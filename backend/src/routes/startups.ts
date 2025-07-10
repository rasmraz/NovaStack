import express from 'express';
import Startup from '../models/Startup';
import { authenticate, optionalAuth, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Get all startups (with pagination, search, and filters)
router.get('/', optionalAuth, async (req: AuthRequest, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const industry = req.query.industry as string;
    const stage = req.query.stage as string;
    const tags = req.query.tags as string;
    const featured = req.query.featured === 'true';
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = { isPublic: true, status: 'active' };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (industry) {
      query.industry = industry;
    }
    
    if (stage) {
      query.stage = stage;
    }
    
    if (tags) {
      const tagsArray = tags.split(',').map(t => t.trim());
      query.tags = { $in: tagsArray };
    }
    
    if (featured) {
      query.isFeatured = true;
    }
    
    const startups = await Startup.find(query)
      .populate('founder', 'firstName lastName username avatar reputationScore')
      .populate('coFounders', 'firstName lastName username avatar')
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Startup.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        startups,
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

// Create new startup
router.post('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Authentication required', 401);
    }
    
    const {
      name,
      tagline,
      description,
      industry,
      stage,
      businessModel,
      targetMarket,
      competitiveAdvantage,
      revenueModel,
      fundingGoal,
      tags
    } = req.body;
    
    // Validation
    if (!name || !tagline || !description || !industry || !stage) {
      throw createError('Required fields: name, tagline, description, industry, stage', 400);
    }
    
    const startup = new Startup({
      name,
      tagline,
      description,
      industry,
      stage,
      businessModel,
      targetMarket,
      competitiveAdvantage,
      revenueModel,
      fundingGoal,
      tags: tags || [],
      founder: req.user._id
    });
    
    await startup.save();
    await startup.populate('founder', 'firstName lastName username avatar');
    
    res.status(201).json({
      success: true,
      message: 'Startup created successfully',
      data: { startup }
    });
  } catch (error) {
    next(error);
  }
});

// Get startup by ID
router.get('/:id', optionalAuth, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    
    const startup = await Startup.findById(id)
      .populate('founder', 'firstName lastName username avatar reputationScore bio')
      .populate('coFounders', 'firstName lastName username avatar reputationScore')
      .populate('teamMembers.user', 'firstName lastName username avatar')
      .populate('investors.user', 'firstName lastName username avatar');
    
    if (!startup) {
      throw createError('Startup not found', 404);
    }
    
    // Check if user can view this startup
    if (!startup.isPublic && (!req.user || 
        ((req.user._id as any).toString() !== (startup.founder._id as any).toString() &&
         !startup.coFounders.some(cf => (cf._id as any).toString() === (req.user!._id as any).toString()) &&
         !startup.teamMembers.some(tm => (tm.user._id as any).toString() === (req.user!._id as any).toString())))) {
      throw createError('Access denied', 403);
    }
    
    // Increment view count
    startup.viewCount += 1;
    await startup.save();
    
    res.json({
      success: true,
      data: { startup }
    });
  } catch (error) {
    next(error);
  }
});

// Update startup
router.put('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Authentication required', 401);
    }
    
    const { id } = req.params;
    const startup = await Startup.findById(id);
    
    if (!startup) {
      throw createError('Startup not found', 404);
    }
    
    // Check if user has permission to update
    if (startup.founder.toString() !== (req.user!._id as any).toString() &&
        !startup.coFounders.some(cf => cf.toString() === (req.user!._id as any).toString())) {
      throw createError('Access denied. Only founders and co-founders can update startup', 403);
    }
    
    const allowedUpdates = [
      'name', 'tagline', 'description', 'logo', 'website', 'industry',
      'stage', 'businessModel', 'targetMarket', 'competitiveAdvantage',
      'revenueModel', 'fundingGoal', 'tags', 'isPublic'
    ];
    
    const updates = Object.keys(req.body)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});
    
    const updatedStartup = await Startup.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('founder', 'firstName lastName username avatar');
    
    res.json({
      success: true,
      message: 'Startup updated successfully',
      data: { startup: updatedStartup }
    });
  } catch (error) {
    next(error);
  }
});

// Add team member
router.post('/:id/team', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Authentication required', 401);
    }
    
    const { id } = req.params;
    const { userId, role, equity } = req.body;
    
    const startup = await Startup.findById(id);
    if (!startup) {
      throw createError('Startup not found', 404);
    }
    
    // Check permissions
    if (startup.founder.toString() !== (req.user!._id as any).toString() &&
        !startup.coFounders.some(cf => cf.toString() === (req.user!._id as any).toString())) {
      throw createError('Access denied', 403);
    }
    
    // Check if user is already a team member
    if (startup.teamMembers.some(tm => tm.user.toString() === userId)) {
      throw createError('User is already a team member', 400);
    }
    
    startup.teamMembers.push({
      user: userId,
      role,
      equity,
      joinedAt: new Date()
    });
    
    await startup.save();
    await startup.populate('teamMembers.user', 'firstName lastName username avatar');
    
    res.json({
      success: true,
      message: 'Team member added successfully',
      data: { startup }
    });
  } catch (error) {
    next(error);
  }
});

// Like/Unlike startup
router.post('/:id/like', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Authentication required', 401);
    }
    
    const { id } = req.params;
    const startup = await Startup.findById(id);
    
    if (!startup) {
      throw createError('Startup not found', 404);
    }
    
    // For now, just increment like count
    // In a full implementation, you'd track which users liked which startups
    startup.likeCount += 1;
    await startup.save();
    
    res.json({
      success: true,
      message: 'Startup liked successfully',
      data: { likeCount: startup.likeCount }
    });
  } catch (error) {
    next(error);
  }
});

// Get trending startups
router.get('/trending/all', async (req, res, next) => {
  try {
    const startups = await Startup.find({ 
      isPublic: true, 
      status: 'active' 
    })
      .populate('founder', 'firstName lastName username avatar')
      .sort({ viewCount: -1, likeCount: -1 })
      .limit(10);
    
    res.json({
      success: true,
      data: { startups }
    });
  } catch (error) {
    next(error);
  }
});

export default router;