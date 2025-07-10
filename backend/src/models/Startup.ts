import mongoose, { Document, Schema } from 'mongoose';

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

const startupSchema = new Schema<IStartup>({
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
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coFounders: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  teamMembers: [{
    user: {
      type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
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

// Indexes for search and performance
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

// Virtual for funding progress
startupSchema.virtual('fundingProgress').get(function() {
  if (!this.fundingGoal || this.fundingGoal === 0) return 0;
  return Math.min((this.currentFunding / this.fundingGoal) * 100, 100);
});

// Virtual for team size
startupSchema.virtual('teamSize').get(function() {
  return 1 + this.coFounders.length + this.teamMembers.length;
});

// Ensure virtual fields are serialized
startupSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc: any, ret: any) {
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model<IStartup>('Startup', startupSchema);