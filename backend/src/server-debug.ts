import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Basic middleware
app.use(compression());
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'NovaStack Backend',
    version: '1.0.0'
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'NovaStack API is working!',
    timestamp: new Date().toISOString()
  });
});

// Try loading routes one by one
try {
  console.log('Loading auth routes...');
  const authRoutes = require('./routes/auth').default;
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded');
} catch (error) {
  console.error('❌ Error loading auth routes:', error);
}

try {
  console.log('Loading user routes...');
  const userRoutes = require('./routes/users').default;
  app.use('/api/users', userRoutes);
  console.log('✅ User routes loaded');
} catch (error) {
  console.error('❌ Error loading user routes:', error);
}

try {
  console.log('Loading startup routes...');
  const startupRoutes = require('./routes/startups').default;
  app.use('/api/startups', startupRoutes);
  console.log('✅ Startup routes loaded');
} catch (error) {
  console.error('❌ Error loading startup routes:', error);
}

try {
  console.log('Loading investment routes...');
  const investmentRoutes = require('./routes/investments').default;
  app.use('/api/investments', investmentRoutes);
  console.log('✅ Investment routes loaded');
} catch (error) {
  console.error('❌ Error loading investment routes:', error);
}

try {
  console.log('Loading collaboration routes...');
  const collaborationRoutes = require('./routes/collaboration').default;
  app.use('/api/collaboration', collaborationRoutes);
  console.log('✅ Collaboration routes loaded');
} catch (error) {
  console.error('❌ Error loading collaboration routes:', error);
}

try {
  console.log('Loading payment routes...');
  const paymentRoutes = require('./routes/payments').default;
  app.use('/api/payments', paymentRoutes);
  console.log('✅ Payment routes loaded');
} catch (error) {
  console.error('❌ Error loading payment routes:', error);
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 NovaStack Backend running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base: http://localhost:${PORT}/api`);
});