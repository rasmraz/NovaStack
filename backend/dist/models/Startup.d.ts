import mongoose, { Document } from 'mongoose';
export interface IStartup extends Document {
    name: string;
    tagline: string;
    description: string;
    logo?: string;
    website?: string;
    industry: string;
    stage: 'idea' | 'prototype' | 'mvp' | 'early-stage' | 'growth' | 'scale';
    status: 'active' | 'paused' | 'completed' | 'archived';
    founder: mongoose.Types.ObjectId;
    coFounders: mongoose.Types.ObjectId[];
    teamMembers: {
        user: mongoose.Types.ObjectId;
        role: string;
        equity?: number;
        joinedAt: Date;
    }[];
    tags: string[];
    pitchDeck?: {
        url: string;
        uploadedAt: Date;
    };
    businessModel: string;
    targetMarket: string;
    competitiveAdvantage: string;
    revenueModel: string;
    fundingGoal?: number;
    currentFunding: number;
    investors: {
        user: mongoose.Types.ObjectId;
        amount: number;
        investedAt: Date;
        terms?: string;
    }[];
    milestones: {
        title: string;
        description: string;
        targetDate: Date;
        completed: boolean;
        completedAt?: Date;
    }[];
    metrics: {
        users?: number;
        revenue?: number;
        growth?: number;
        lastUpdated: Date;
    };
    socialLinks: {
        twitter?: string;
        linkedin?: string;
        facebook?: string;
        instagram?: string;
    };
    isPublic: boolean;
    isFeatured: boolean;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IStartup, {}, {}, {}, mongoose.Document<unknown, {}, IStartup, {}> & IStartup & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Startup.d.ts.map