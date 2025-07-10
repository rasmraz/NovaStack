import express from 'express';
import User from '../models/User';
import { authenticate, optionalAuth, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Get all users (with pagination and search)
router.get('/', optionalAuth, async (req: AuthRequest, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const skills = req.query.skills as string;
    const interests = req.query.interests as string;
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query.skills = { $in: skillsArray };
    }
    
    if (interests) {
      const interestsArray = interests.split(',').map(i => i.trim());
      query.interests = { $in: interestsArray };
    }
    
    const users = await User.find(query)
      .select('-password -email')
      .sort({ reputationScore: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await User.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get user by username
router.get('/:username', optionalAuth, async (req: AuthRequest, res, next) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username })
      .select('-password')
      .populate('experience.company')
      .populate('education.institution');
    
    if (!user) {
      throw createError('User not found', 404);
    }
    
    // Hide email if not the user themselves
    const userData = user.toJSON();
    if (!req.user || (req.user._id as any).toString() !== (user._id as any).toString()) {
      delete (userData as any).email;
    }
    
    res.json({
      success: true,
      data: { user: userData }
    });
  } catch (error) {
    next(error);
  }
});

// Follow/Unfollow user (for future implementation)
router.post('/:userId/follow', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { userId } = req.params;
    
    if (!req.user) {
      throw createError('Authentication required', 401);
    }
    
    if ((req.user._id as any).toString() === userId) {
      throw createError('Cannot follow yourself', 400);
    }
    
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      throw createError('User not found', 404);
    }
    
    // This would require adding followers/following arrays to the User model
    // For now, just return success
    res.json({
      success: true,
      message: 'Follow functionality coming soon!'
    });
  } catch (error) {
    next(error);
  }
});

// Get user's startups
router.get('/:username/startups', async (req, res, next) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username });
    if (!user) {
      throw createError('User not found', 404);
    }
    
    // This would require importing Startup model and finding startups
    // where user is founder, co-founder, or team member
    res.json({
      success: true,
      data: {
        startups: [],
        message: 'Startup listings coming soon!'
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update user reputation (admin only - for future implementation)
router.put('/:userId/reputation', authenticate, async (req: AuthRequest, res, next) => {
  try {
    // This would require admin role checking
    res.json({
      success: true,
      message: 'Reputation system coming soon!'
    });
  } catch (error) {
    next(error);
  }
});

export default router;