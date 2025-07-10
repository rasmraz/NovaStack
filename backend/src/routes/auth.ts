import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { createError } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Generate JWT token
const generateToken = (userId: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw createError('JWT secret not configured', 500);
  }
  
  return jwt.sign({ userId }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  } as jwt.SignOptions);
};

// Register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, username } = req.body;
    
    // Validation
    if (!email || !password || !firstName || !lastName || !username) {
      throw createError('All fields are required', 400);
    }
    
    if (password.length < 8) {
      throw createError('Password must be at least 8 characters long', 400);
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      throw createError('User with this email or username already exists', 409);
    }
    
    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      username: username.toLowerCase()
    });
    
    await user.save();
    
    // Generate token
    const token = generateToken((user._id as any).toString());
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          subscriptionTier: user.subscriptionTier
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      throw createError('Email and password are required', 400);
    }
    
    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      throw createError('Invalid email or password', 401);
    }
    
    // Generate token
    const token = generateToken((user._id as any).toString());
    
    // Update last active
    user.lastActive = new Date();
    await user.save();
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          avatar: user.avatar,
          subscriptionTier: user.subscriptionTier,
          reputationScore: user.reputationScore,
          isVerified: user.isVerified
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get current user profile
router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('User not found', 404);
    }
    
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update profile
router.put('/profile', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('User not found', 404);
    }
    
    const allowedUpdates = [
      'firstName', 'lastName', 'bio', 'location', 'website',
      'linkedIn', 'twitter', 'github', 'skills', 'interests'
    ];
    
    const updates = Object.keys(req.body)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

// Change password
router.put('/password', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('User not found', 404);
    }
    
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      throw createError('Current password and new password are required', 400);
    }
    
    if (newPassword.length < 8) {
      throw createError('New password must be at least 8 characters long', 400);
    }
    
    // Get user with password
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      throw createError('User not found', 404);
    }
    
    // Verify current password
    if (!(await user.comparePassword(currentPassword))) {
      throw createError('Current password is incorrect', 400);
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Refresh token
router.post('/refresh', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('User not found', 404);
    }
    
    const token = generateToken((req.user._id as any).toString());
    
    res.json({
      success: true,
      data: { token }
    });
  } catch (error) {
    next(error);
  }
});

export default router;