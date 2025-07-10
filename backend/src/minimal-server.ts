import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'NovaStack Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Mock API endpoints for frontend testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    message: 'Registration endpoint ready',
    data: { user: { id: '1', email: req.body.email } }
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login endpoint ready',
    data: { 
      user: { id: '1', email: req.body.email },
      token: 'mock-jwt-token'
    }
  });
});

app.get('/api/startups', (req, res) => {
  res.json({
    success: true,
    data: {
      startups: [
        {
          id: '1',
          name: 'TechVenture',
          tagline: 'Revolutionizing the future',
          description: 'A sample startup for demo purposes',
          industry: 'Technology',
          stage: 'Seed',
          fundingGoal: 100000,
          likeCount: 42,
          viewCount: 156
        }
      ],
      pagination: { page: 1, pages: 1, total: 1 }
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 NovaStack Backend (minimal) running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base: http://localhost:${PORT}/api`);
});