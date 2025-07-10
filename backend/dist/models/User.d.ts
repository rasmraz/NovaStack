import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
    linkedIn?: string;
    twitter?: string;
    github?: string;
    skills: string[];
    interests: string[];
    experience: {
        title: string;
        company: string;
        duration: string;
        description?: string;
    }[];
    education: {
        degree: string;
        institution: string;
        year: string;
    }[];
    reputationScore: number;
    isVerified: boolean;
    isInvestor: boolean;
    investorProfile?: {
        accreditedInvestor: boolean;
        investmentRange: {
            min: number;
            max: number;
        };
        focusAreas: string[];
        portfolioCompanies: string[];
    };
    subscriptionTier: 'free' | 'pro' | 'enterprise';
    stripeCustomerId?: string;
    createdAt: Date;
    updatedAt: Date;
    lastActive: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map