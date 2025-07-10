"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const startupSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    tagline: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000
    },
    logo: String,
    website: String,
    industry: {
        type: String,
        required: true
    },
    stage: {
        type: String,
        enum: ['idea', 'prototype', 'mvp', 'early-stage', 'growth', 'scale'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'completed', 'archived'],
        default: 'active'
    },
    founder: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coFounders: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }],
    teamMembers: [{
            user: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            role: {
                type: String,
                required: true
            },
            equity: {
                type: Number,
                min: 0,
                max: 100
            },
            joinedAt: {
                type: Date,
                default: Date.now
            }
        }],
    tags: [String],
    pitchDeck: {
        url: String,
        uploadedAt: Date
    },
    businessModel: String,
    targetMarket: String,
    competitiveAdvantage: String,
    revenueModel: String,
    fundingGoal: {
        type: Number,
        min: 0
    },
    currentFunding: {
        type: Number,
        default: 0,
        min: 0
    },
    investors: [{
            user: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            amount: {
                type: Number,
                required: true,
                min: 0
            },
            investedAt: {
                type: Date,
                default: Date.now
            },
            terms: String
        }],
    milestones: [{
            title: {
                type: String,
                required: true
            },
            description: String,
            targetDate: Date,
            completed: {
                type: Boolean,
                default: false
            },
            completedAt: Date
        }],
    metrics: {
        users: {
            type: Number,
            min: 0
        },
        revenue: {
            type: Number,
            min: 0
        },
        growth: {
            type: Number,
            min: -100,
            max: 1000
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },
    socialLinks: {
        twitter: String,
        linkedin: String,
        facebook: String,
        instagram: String
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    viewCount: {
        type: Number,
        default: 0
    },
    likeCount: {
        type: Number,
        default: 0
    },
    commentCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
startupSchema.index({ name: 'text', tagline: 'text', description: 'text' });
startupSchema.index({ industry: 1 });
startupSchema.index({ stage: 1 });
startupSchema.index({ status: 1 });
startupSchema.index({ tags: 1 });
startupSchema.index({ founder: 1 });
startupSchema.index({ isPublic: 1 });
startupSchema.index({ isFeatured: 1 });
startupSchema.index({ createdAt: -1 });
startupSchema.index({ viewCount: -1 });
startupSchema.index({ likeCount: -1 });
startupSchema.virtual('fundingProgress').get(function () {
    if (!this.fundingGoal || this.fundingGoal === 0)
        return 0;
    return Math.min((this.currentFunding / this.fundingGoal) * 100, 100);
});
startupSchema.virtual('teamSize').get(function () {
    return 1 + this.coFounders.length + this.teamMembers.length;
});
startupSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    }
});
exports.default = mongoose_1.default.model('Startup', startupSchema);
//# sourceMappingURL=Startup.js.map