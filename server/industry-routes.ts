import { Router, Request, Response } from 'express';
import { storage } from './storage';
import { industries, insertIndustrySchema } from '../shared/schema';
import { db } from './db';
import { eq } from 'drizzle-orm';

export const industryRouter = Router();

// Middleware to check if user is authenticated
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: 'Not authenticated' });
}

// Get all industries
industryRouter.get("/industries", async (req: Request, res: Response) => {
  try {
    const allIndustries = await db.select().from(industries);
    res.json(allIndustries);
  } catch (error) {
    console.error('Error fetching industries:', error);
    res.status(500).json({ message: 'Failed to fetch industries' });
  }
});

// Create a new industry (admin only in a real app)
industryRouter.post("/industries", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const validatedData = insertIndustrySchema.parse(req.body);
    const [industry] = await db.insert(industries).values(validatedData).returning();
    res.status(201).json(industry);
  } catch (error) {
    console.error('Error creating industry:', error);
    res.status(400).json({ message: 'Failed to create industry' });
  }
});

// Get similar users based on industry
industryRouter.get("/users/similar", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { industryId, limit = 10 } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!industryId) {
      return res.status(400).json({ message: 'Industry ID is required' });
    }

    const similarUsers = await storage.getSimilarUsers(
      Number(userId), 
      Number(industryId), 
      Number(limit)
    );
    
    res.json(similarUsers);
  } catch (error) {
    console.error('Error finding similar users:', error);
    res.status(500).json({ message: 'Failed to find similar users' });
  }
});

// Discover users with filters
industryRouter.get("/users/discover", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const filters = {
      industryId: req.query.industryId ? Number(req.query.industryId) : undefined,
      location: req.query.location as string | undefined,
      tags: req.query.tags ? (req.query.tags as string).split(',') : undefined
    };

    const users = await storage.discoverUsers(Number(userId), filters);
    res.json(users);
  } catch (error) {
    console.error('Error discovering users:', error);
    res.status(500).json({ message: 'Failed to discover users' });
  }
});

// Follow a user
industryRouter.post("/follows", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const followerId = req.user?.id;
    const { followingId } = req.body;

    if (!followerId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!followingId) {
      return res.status(400).json({ message: 'Following ID is required' });
    }

    const follow = await storage.followUser(Number(followerId), Number(followingId));
    res.status(201).json(follow);
  } catch (error) {
    console.error('Error following user:', error);
    res.status(400).json({ message: 'Failed to follow user' });
  }
});

// Unfollow a user
industryRouter.delete("/follows/:followingId", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const followerId = req.user?.id;
    const { followingId } = req.params;

    if (!followerId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const success = await storage.unfollowUser(Number(followerId), Number(followingId));
    
    if (success) {
      res.status(200).json({ message: 'Successfully unfollowed user' });
    } else {
      res.status(404).json({ message: 'Follow relationship not found' });
    }
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(400).json({ message: 'Failed to unfollow user' });
  }
});

// Check if following a user
industryRouter.get("/follows/:followingId", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const followerId = req.user?.id;
    const { followingId } = req.params;

    if (!followerId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const isFollowing = await storage.isFollowing(Number(followerId), Number(followingId));
    res.json({ isFollowing });
  } catch (error) {
    console.error('Error checking follow status:', error);
    res.status(500).json({ message: 'Failed to check follow status' });
  }
});