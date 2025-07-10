import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

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

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  avatar: String,
  bio: {
    type: String,
    maxlength: 500
  },
  location: String,
  website: String,
  linkedIn: String,
  twitter: String,
  github: String,
  skills: [String],
  interests: [String],
  experience: [{
    title: { type: String, required: true },
    company: { type: String, required: true },
    duration: { type: String, required: true },
    description: String
  }],
  education: [{
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    year: { type: String, required: true }
  }],
  reputationScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 1000
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isInvestor: {
    type: Boolean,
    default: false
  },
  investorProfile: {
    accreditedInvestor: Boolean,
    investmentRange: {
      min: Number,
      max: Number
    },
    focusAreas: [String],
    portfolioCompanies: [String]
  },
  subscriptionTier: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  stripeCustomerId: String,
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search optimization (email and username already indexed via unique: true)
userSchema.index({ skills: 1 });
userSchema.index({ interests: 1 });
userSchema.index({ reputationScore: -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc: any, ret: any) {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model<IUser>('User', userSchema);