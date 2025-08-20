import { Express, Request, Response, NextFunction } from "express";
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

// Conditional logger for auth flow
const authLog = (...args: any[]) => {
  if (process.env.LOG_AUTH === "1") {
    console.log(...args);
  }
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

  const isProd = process.env.NODE_ENV === "production";
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "mylinked-secret-key",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
    name: 'mylinked.session'
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const normalizedUsername = username.trim().toLowerCase();
      try {
        authLog('Login attempt for username:', normalizedUsername);
        const user = await storage.getUserByUsername(normalizedUsername);
        if (!user) {
          authLog('User not found:', normalizedUsername);
          return done(null, false, { message: "Invalid username or password" });
        }

        authLog('User found, checking password');
        const isPasswordValid = await storage.comparePasswords(password, user.password);
        authLog('Password valid:', isPasswordValid);

        if (!isPasswordValid) {
          authLog('Password verification failed for user:', normalizedUsername);
          return done(null, false, { message: "Invalid username or password" });
        }

        authLog('Login successful for user:', normalizedUsername);
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
      let { username, password, name, email, bio } = req.body;
      username = username?.trim().toLowerCase();
      email = email?.trim().toLowerCase();
      authLog('Register attempt:', { username, email });

      // Check if user already exists by username
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        authLog('Registration failed: username taken', username);
        return res.status(409).json({ message: "Username already exists" });
      }

      // Check if email already exists
      if (email) {
        const existingEmail = await storage.getUserByEmail(email);
        if (existingEmail) {
          authLog('Registration failed: email taken', email);
          return res.status(409).json({ message: "Email already exists" });
        }
      }

      // Create user (storage will handle password hashing)
      const user = await storage.createUser({
        username,
        password,
        name,
        email,
        bio,
      });

      // Log user in
      req.login(user as any, (err) => {
        if (err) return next(err);
        authLog('Registration successful for user:', username);
        authLog('Set-Cookie on register:', !!res.getHeader('set-cookie'));
        return res.status(201).json({ message: "User registered successfully", user });
      });
    } catch (error) {
      next(error);
    }
  });

  // Login route using Passport.js local strategy
  app.post("/api/login", (req, res, next) => {
    authLog('Login route called with body:', { username: req.body?.username });
    passport.authenticate("local", (err: any, user: any, info: any) => {
      authLog('Passport authenticate callback:', { err, user: !!user, info });
      if (err) {
        console.error('Authentication error:', err);
        return next(err);
      }
      if (!user) {
        authLog('Authentication failed:', info);
        return res.status(401).json({ message: info?.message || "Authentication failed" });
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error('Login error:', err);
          return next(err);
        }
        authLog('Login successful for user:', user.username);
        authLog('Set-Cookie on login:', !!res.getHeader('set-cookie'));
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