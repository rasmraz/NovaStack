"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const errorHandler_1 = require("../middleware/errorHandler");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const generateToken = (userId) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw (0, errorHandler_1.createError)('JWT secret not configured', 500);
    }
    return jsonwebtoken_1.default.sign({ userId }, jwtSecret, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};
router.post('/register', async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, username } = req.body;
        if (!email || !password || !firstName || !lastName || !username) {
            throw (0, errorHandler_1.createError)('All fields are required', 400);
        }
        if (password.length < 8) {
            throw (0, errorHandler_1.createError)('Password must be at least 8 characters long', 400);
        }
        const existingUser = await User_1.default.findOne({
            $or: [{ email }, { username }]
        });
        if (existingUser) {
            throw (0, errorHandler_1.createError)('User with this email or username already exists', 409);
        }
        const user = new User_1.default({
            email,
            password,
            firstName,
            lastName,
            username: username.toLowerCase()
        });
        await user.save();
        const token = generateToken(user._id.toString());
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
    }
    catch (error) {
        next(error);
    }
});
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw (0, errorHandler_1.createError)('Email and password are required', 400);
        }
        const user = await User_1.default.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            throw (0, errorHandler_1.createError)('Invalid email or password', 401);
        }
        const token = generateToken(user._id.toString());
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
    }
    catch (error) {
        next(error);
    }
});
router.get('/me', auth_1.authenticate, async (req, res, next) => {
    try {
        if (!req.user) {
            throw (0, errorHandler_1.createError)('User not found', 404);
        }
        res.json({
            success: true,
            data: {
                user: req.user
            }
        });
    }
    catch (error) {
        next(error);
    }
});
router.put('/profile', auth_1.authenticate, async (req, res, next) => {
    try {
        if (!req.user) {
            throw (0, errorHandler_1.createError)('User not found', 404);
        }
        const allowedUpdates = [
            'firstName', 'lastName', 'bio', 'location', 'website',
            'linkedIn', 'twitter', 'github', 'skills', 'interests'
        ];
        const updates = Object.keys(req.body)
            .filter(key => allowedUpdates.includes(key))
            .reduce((obj, key) => {
            obj[key] = req.body[key];
            return obj;
        }, {});
        const user = await User_1.default.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: { user }
        });
    }
    catch (error) {
        next(error);
    }
});
router.put('/password', auth_1.authenticate, async (req, res, next) => {
    try {
        if (!req.user) {
            throw (0, errorHandler_1.createError)('User not found', 404);
        }
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            throw (0, errorHandler_1.createError)('Current password and new password are required', 400);
        }
        if (newPassword.length < 8) {
            throw (0, errorHandler_1.createError)('New password must be at least 8 characters long', 400);
        }
        const user = await User_1.default.findById(req.user._id).select('+password');
        if (!user) {
            throw (0, errorHandler_1.createError)('User not found', 404);
        }
        if (!(await user.comparePassword(currentPassword))) {
            throw (0, errorHandler_1.createError)('Current password is incorrect', 400);
        }
        user.password = newPassword;
        await user.save();
        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/refresh', auth_1.authenticate, async (req, res, next) => {
    try {
        if (!req.user) {
            throw (0, errorHandler_1.createError)('User not found', 404);
        }
        const token = generateToken(req.user._id.toString());
        res.json({
            success: true,
            data: { token }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map