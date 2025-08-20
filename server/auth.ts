import { Express, Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage as defaultStorage } from "./storage";
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

const logAuth = (...args: any[]) => {
  if (process.env.LOG_AUTH === 'true') console.log(...args);
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

export function setupAuth(app: Express, storage = defaultStorage) {
  // Configure session with fallback to memory store if database fails
  const MemoryStore = createMemoryStore(session);
  let sessionStore;
  
  try {
    sessionStore = storage.sessionStore;
  } catch (error) {
    logAuth('Database session store failed, using memory store:', error);
    sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "mylinked-secret-key",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: process.env.COOKIE_DOMAIN || undefined,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
    name: 'mylinked.session'
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure local strategy
  passport.use(
    new LocalStrategy(async (identifier, password, done) => {
      try {
        const normalized = identifier.trim();
        logAuth('Login attempt for:', normalized);
        let user;
        if (normalized.includes('@')) {
          user = await storage.getUserByEmail(normalized.toLowerCase());
        } else {
          user = await storage.getUserByUsername(normalized.toLowerCase());
        }
        if (!user) {
          logAuth('User not found:', normalized);
          return done(null, false, { message: "Invalid username or password" });
        }

        logAuth('User found, checking password...');
        const isPasswordValid = await storage.comparePasswords(password, user.password);
        logAuth('Password valid:', isPasswordValid);

        if (!isPasswordValid) {
          logAuth('Password verification failed for user:', normalized);
          return done(null, false, { message: "Invalid username or password" });
        }

        logAuth('Login successful for user:', normalized);
        return done(null, user as any);
      } catch (error) {
        logAuth('Login error:', error);
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
      const normalizedUsername = username.trim().toLowerCase();
      const normalizedEmail = email?.trim().toLowerCase();

      const existingUser = await storage.getUserByUsername(normalizedUsername);
      if (existingUser) {
        return res.status(409).json({ message: "Username already taken" });
      }

      if (normalizedEmail) {
        const existingEmail = await storage.getUserByEmail(normalizedEmail);
        if (existingEmail) {
          return res.status(409).json({ message: "Email already registered" });
        }
      }

      const user = await storage.createUser({
        username: normalizedUsername,
        password,
        name,
        email: normalizedEmail,
        bio,
      });

      req.login(user as any, (err) => {
        if (err) return next(err);
        return res.status(201).json({ message: "User registered successfully", user });
      });
    } catch (error: any) {
      if (error?.message && /unique/i.test(error.message)) {
        return res.status(409).json({ message: "Username or email already exists" });
      }
      next(error);
    }
  });

  // Login route using Passport.js local strategy
  app.post("/api/login", (req, res, next) => {
    logAuth('Login route called with body:', req.body);
    passport.authenticate("local", (err: any, user: any, info: any) => {
      logAuth('Passport authenticate callback:', { err, user: !!user, info });
      if (err) {
        logAuth('Authentication error:', err);
        return next(err);
      }
      if (!user) {
        logAuth('Authentication failed:', info);
        return res.status(401).json({ message: info?.message || "Authentication failed" });
      }
      req.logIn(user, (err) => {
        if (err) {
          logAuth('Login error:', err);
          return next(err);
        }
        logAuth('Login successful for user:', user.username);
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