"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Startup_1 = __importDefault(require("../models/Startup"));
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const router = express_1.default.Router();
router.get('/', auth_1.optionalAuth, async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search;
        const industry = req.query.industry;
        const stage = req.query.stage;
        const tags = req.query.tags;
        const featured = req.query.featured === 'true';
        const skip = (page - 1) * limit;
        const query = { isPublic: true, status: 'active' };
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
        const startups = await Startup_1.default.find(query)
            .populate('founder', 'firstName lastName username avatar reputationScore')
            .populate('coFounders', 'firstName lastName username avatar')
            .sort({ isFeatured: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await Startup_1.default.countDocuments(query);
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
    }
    catch (error) {
        next(error);
    }
});
router.post('/', auth_1.authenticate, async (req, res, next) => {
    try {
        if (!req.user) {
            throw (0, errorHandler_1.createError)('Authentication required', 401);
        }
        const { name, tagline, description, industry, stage, businessModel, targetMarket, competitiveAdvantage, revenueModel, fundingGoal, tags } = req.body;
        if (!name || !tagline || !description || !industry || !stage) {
            throw (0, errorHandler_1.createError)('Required fields: name, tagline, description, industry, stage', 400);
        }
        const startup = new Startup_1.default({
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
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', auth_1.optionalAuth, async (req, res, next) => {
    try {
        const { id } = req.params;
        const startup = await Startup_1.default.findById(id)
            .populate('founder', 'firstName lastName username avatar reputationScore bio')
            .populate('coFounders', 'firstName lastName username avatar reputationScore')
            .populate('teamMembers.user', 'firstName lastName username avatar')
            .populate('investors.user', 'firstName lastName username avatar');
        if (!startup) {
            throw (0, errorHandler_1.createError)('Startup not found', 404);
        }
        if (!startup.isPublic && (!req.user ||
            (req.user._id.toString() !== startup.founder._id.toString() &&
                !startup.coFounders.some(cf => cf._id.toString() === req.user._id.toString()) &&
                !startup.teamMembers.some(tm => tm.user._id.toString() === req.user._id.toString())))) {
            throw (0, errorHandler_1.createError)('Access denied', 403);
        }
        startup.viewCount += 1;
        await startup.save();
        res.json({
            success: true,
            data: { startup }
        });
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id', auth_1.authenticate, async (req, res, next) => {
    try {
        if (!req.user) {
            throw (0, errorHandler_1.createError)('Authentication required', 401);
        }
        const { id } = req.params;
        const startup = await Startup_1.default.findById(id);
        if (!startup) {
            throw (0, errorHandler_1.createError)('Startup not found', 404);
        }
        if (startup.founder.toString() !== req.user._id.toString() &&
            !startup.coFounders.some(cf => cf.toString() === req.user._id.toString())) {
            throw (0, errorHandler_1.createError)('Access denied. Only founders and co-founders can update startup', 403);
        }
        const allowedUpdates = [
            'name', 'tagline', 'description', 'logo', 'website', 'industry',
            'stage', 'businessModel', 'targetMarket', 'competitiveAdvantage',
            'revenueModel', 'fundingGoal', 'tags', 'isPublic'
        ];
        const updates = Object.keys(req.body)
            .filter(key => allowedUpdates.includes(key))
            .reduce((obj, key) => {
            obj[key] = req.body[key];
            return obj;
        }, {});
        const updatedStartup = await Startup_1.default.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).populate('founder', 'firstName lastName username avatar');
        res.json({
            success: true,
            message: 'Startup updated successfully',
            data: { startup: updatedStartup }
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/:id/team', auth_1.authenticate, async (req, res, next) => {
    try {
        if (!req.user) {
            throw (0, errorHandler_1.createError)('Authentication required', 401);
        }
        const { id } = req.params;
        const { userId, role, equity } = req.body;
        const startup = await Startup_1.default.findById(id);
        if (!startup) {
            throw (0, errorHandler_1.createError)('Startup not found', 404);
        }
        if (startup.founder.toString() !== req.user._id.toString() &&
            !startup.coFounders.some(cf => cf.toString() === req.user._id.toString())) {
            throw (0, errorHandler_1.createError)('Access denied', 403);
        }
        if (startup.teamMembers.some(tm => tm.user.toString() === userId)) {
            throw (0, errorHandler_1.createError)('User is already a team member', 400);
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
    }
    catch (error) {
        next(error);
    }
});
router.post('/:id/like', auth_1.authenticate, async (req, res, next) => {
    try {
        if (!req.user) {
            throw (0, errorHandler_1.createError)('Authentication required', 401);
        }
        const { id } = req.params;
        const startup = await Startup_1.default.findById(id);
        if (!startup) {
            throw (0, errorHandler_1.createError)('Startup not found', 404);
        }
        startup.likeCount += 1;
        await startup.save();
        res.json({
            success: true,
            message: 'Startup liked successfully',
            data: { likeCount: startup.likeCount }
        });
    }
    catch (error) {
        next(error);
    }
});
router.get('/trending/all', async (req, res, next) => {
    try {
        const startups = await Startup_1.default.find({
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
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=startups.js.map