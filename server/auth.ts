import { Express, Request, Response, NextFunction, RequestHandler } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as UserType } from "../shared/schema";
import createMemoryStore from "memorystore";

// Extend the Express namespace for TypeScript
declare global {
  namespace Express {
    // Define a custom User interface that matches our UserType
    interface User extends Omit<UserType, 'socialScore'> {
      socialScore?: number;
    }
    // Session interface for OAuth state management
    interface Session {
      twitterCodeVerifier?: string;
      twitterState?: string;
    }
  }
}

const scryptAsync = promisify(scrypt);
const LOG = process.env.LOG_AUTH === '1' ? console.info : () => {};

const simpleCors: RequestHandler = (req, res, next) => {
  const origin = req.headers.origin as string | undefined;
  const allowed = (process.env.CORS_ORIGIN || '').split(',').filter(Boolean);
  if (!allowed.length || (origin && allowed.includes(origin))) {
    if (origin) res.header('Access-Control-Allow-Origin', origin);
    else res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
};

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  if (!hashed || !salt) return false;
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET must be set');
  }
  LOG('env', { SESSION_SECRET: !!process.env.SESSION_SECRET });

  // Configure session with fallback to memory store if database fails
  const MemoryStore = createMemoryStore(session);
  let sessionStore;
  
  try {
    // Try to use database session store
    sessionStore = storage.sessionStore;
  } catch (error) {
    console.warn('Database session store failed, using memory store:', error);
    sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  app.use(simpleCors);

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
    name: 'mylinked.session'
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure local strategy
  passport.use(
    new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, async (identifier, password, done) => {
      try {
        const trimmed = identifier.trim();
        const isEmail = trimmed.includes('@');
        const normalized = trimmed.toLowerCase();
        LOG('login-attempt', { identifier: normalized });
        let user = isEmail
          ? await storage.getUserByEmail(normalized)
          : await storage.getUserByUsername(normalized);
        if (!user) {
          LOG('user-not-found', normalized);
          return done(null, false, { message: "Invalid username or password" });
        }

        const isPasswordValid = await storage.comparePasswords(password, user.password);
        LOG('password-check', { ok: isPasswordValid });

        if (!isPasswordValid) {
          LOG('password-invalid', normalized);
          return done(null, false, { message: "Invalid username or password" });
        }

        LOG('login-success', normalized);
        return done(null, user as any);
      } catch (error) {
        console.error('Login error:', error);
        return done(error);
      }
    })
  );

  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: number | string, done) => {
    try {
      // Session stores may return the ID as a string
      const userId = typeof id === "string" ? parseInt(id, 10) : id;
      if (Number.isNaN(userId)) {
        return done(new Error("Invalid user ID"));
      }

      const user = await storage.getUser(userId);
      done(null, user as any);
    } catch (error) {
      done(error);
    }
  });

  // Authentication routes
  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, password, name, email, bio } = req.body;
      const normalizedUsername = username?.trim().toLowerCase();
      const normalizedEmail = email?.trim().toLowerCase();

      const existingUser =
        (normalizedUsername && await storage.getUserByUsername(normalizedUsername)) ||
        (normalizedEmail && await storage.getUserByEmail(normalizedEmail));
      if (existingUser) {
        return res.status(409).json({ message: "Username or email already exists" });
      }

      const user = await storage.createUser({
        username: normalizedUsername,
        password,
        name,
        email: normalizedEmail,
        bio,
      });

      // Log user in
      req.login(user as any, (err) => {
        if (err) return next(err);
        return res.status(201).json({ message: "User registered successfully", user });
      });
    } catch (error) {
      if ((error as any)?.code === '23505') {
        return res.status(409).json({ message: "Username or email already exists" });
      }
      next(error);
    }
  });

  // Login route using Passport.js local strategy
  app.post("/api/login", (req, res, next) => {
    console.log('Login route called with body:', req.body);
    passport.authenticate("local", (err: any, user: any, info: any) => {
      console.log('Passport authenticate callback:', { err, user: !!user, info });
      if (err) {
        console.error('Authentication error:', err);
        return next(err);
      }
      if (!user) {
        console.log('Authentication failed:', info);
        return res.status(401).json({ message: info?.message || "Authentication failed" });
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error('Login error:', err);
          return next(err);
        }
        console.log('Login successful for user:', user.username);
        return res.json({ 
          message: "Login successful", 
          user: user 
        });
      });
    })(req, res, next);
  });

  // Logout route
  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user route
  app.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });
}

// Middleware to check if user is authenticated
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
}

// Middleware to check if user is the owner of a resource
export function isOwner(paramName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && req.user && req.user.id === parseInt(req.params[paramName])) {
      return next();
    }
    return res.status(403).json({ message: "Forbidden" });
  };
}