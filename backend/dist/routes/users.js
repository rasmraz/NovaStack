"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const router = express_1.default.Router();
router.get('/', auth_1.optionalAuth, async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search;
        const skills = req.query.skills;
        const interests = req.query.interests;
        const skip = (page - 1) * limit;
        const query = {};
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
        const users = await User_1.default.find(query)
            .select('-password -email')
            .sort({ reputationScore: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await User_1.default.countDocuments(query);
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
    }
    catch (error) {
        next(error);
    }
});
router.get('/:username', auth_1.optionalAuth, async (req, res, next) => {
    try {
        const { username } = req.params;
        const user = await User_1.default.findOne({ username })
            .select('-password')
            .populate('experience.company')
            .populate('education.institution');
        if (!user) {
            throw (0, errorHandler_1.createError)('User not found', 404);
        }
        const userData = user.toJSON();
        if (!req.user || req.user._id.toString() !== user._id.toString()) {
            delete userData.email;
        }
        res.json({
            success: true,
            data: { user: userData }
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/:userId/follow', auth_1.authenticate, async (req, res, next) => {
    try {
        const { userId } = req.params;
        if (!req.user) {
            throw (0, errorHandler_1.createError)('Authentication required', 401);
        }
        if (req.user._id.toString() === userId) {
            throw (0, errorHandler_1.createError)('Cannot follow yourself', 400);
        }
        const userToFollow = await User_1.default.findById(userId);
        if (!userToFollow) {
            throw (0, errorHandler_1.createError)('User not found', 404);
        }
        res.json({
            success: true,
            message: 'Follow functionality coming soon!'
        });
    }
    catch (error) {
        next(error);
    }
});
router.get('/:username/startups', async (req, res, next) => {
    try {
        const { username } = req.params;
        const user = await User_1.default.findOne({ username });
        if (!user) {
            throw (0, errorHandler_1.createError)('User not found', 404);
        }
        res.json({
            success: true,
            data: {
                startups: [],
                message: 'Startup listings coming soon!'
            }
        });
    }
    catch (error) {
        next(error);
    }
});
router.put('/:userId/reputation', auth_1.authenticate, async (req, res, next) => {
    try {
        res.json({
            success: true,
            message: 'Reputation system coming soon!'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map