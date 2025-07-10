// MongoDB initialization script
db = db.getSiblingDB('novastack');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'firstName', 'lastName', 'username'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        },
        username: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 30
        },
        reputationScore: {
          bsonType: 'number',
          minimum: 0,
          maximum: 1000
        }
      }
    }
  }
});

db.createCollection('startups', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'tagline', 'description', 'industry', 'stage', 'founder'],
      properties: {
        name: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 100
        },
        stage: {
          bsonType: 'string',
          enum: ['idea', 'prototype', 'mvp', 'early-stage', 'growth', 'scale']
        },
        status: {
          bsonType: 'string',
          enum: ['active', 'paused', 'completed', 'archived']
        }
      }
    }
  }
});

// Create indexes for performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ skills: 1 });
db.users.createIndex({ interests: 1 });
db.users.createIndex({ reputationScore: -1 });

db.startups.createIndex({ name: 'text', tagline: 'text', description: 'text' });
db.startups.createIndex({ industry: 1 });
db.startups.createIndex({ stage: 1 });
db.startups.createIndex({ status: 1 });
db.startups.createIndex({ tags: 1 });
db.startups.createIndex({ founder: 1 });
db.startups.createIndex({ isPublic: 1 });
db.startups.createIndex({ isFeatured: 1 });
db.startups.createIndex({ createdAt: -1 });

print('NovaStack database initialized successfully!');