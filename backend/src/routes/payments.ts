import express from 'express';
import Stripe from 'stripe';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Initialize Stripe (will need STRIPE_SECRET_KEY in env)
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil'
}) : null;

// Create payment intent for investments
router.post('/create-payment-intent', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!stripe) {
      throw createError('Payment processing not configured', 500);
    }
    
    if (!req.user) {
      throw createError('Authentication required', 401);
    }
    
    const { amount, currency = 'usd', startupId } = req.body;
    
    if (!amount || amount < 100) {
      throw createError('Minimum amount is $1.00', 400);
    }
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency,
      metadata: {
        userId: (req.user!._id as any).toString(),
        startupId: startupId || '',
        type: 'investment'
      }
    });
    
    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (error) {
    next(error);
  }
});

// Create subscription for premium features
router.post('/create-subscription', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!stripe) {
      throw createError('Payment processing not configured', 500);
    }
    
    if (!req.user) {
      throw createError('Authentication required', 401);
    }
    
    const { priceId } = req.body;
    
    if (!priceId) {
      throw createError('Price ID is required', 400);
    }
    
    // Create or get Stripe customer
    let customerId = req.user.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: `${req.user.firstName} ${req.user.lastName}`,
        metadata: {
          userId: (req.user!._id as any).toString()
        }
      });
      customerId = customer.id;
      
      // Update user with Stripe customer ID
      req.user.stripeCustomerId = customerId;
      await req.user.save();
    }
    
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
    
    res.json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret
      }
    });
  } catch (error) {
    next(error);
  }
});

// Webhook for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res, next) => {
  try {
    if (!stripe) {
      throw createError('Payment processing not configured', 500);
    }
    
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!endpointSecret) {
      throw createError('Webhook secret not configured', 500);
    }
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      throw createError('Webhook signature verification failed', 400);
    }
    
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        console.log('Payment succeeded:', event.data.object);
        break;
      case 'invoice.payment_succeeded':
        // Handle successful subscription payment
        console.log('Subscription payment succeeded:', event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (error) {
    next(error);
  }
});

// Get pricing plans
router.get('/pricing', async (req, res, next) => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        features: [
          'Create up to 3 startups',
          'Basic collaboration tools',
          'Community access',
          'Basic analytics'
        ]
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 29,
        priceId: 'price_pro_monthly', // This would be actual Stripe price ID
        features: [
          'Unlimited startups',
          'Advanced collaboration tools',
          'AI-powered insights',
          'Priority support',
          'Advanced analytics',
          'Investor matching'
        ]
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 99,
        priceId: 'price_enterprise_monthly',
        features: [
          'Everything in Pro',
          'White-label solution',
          'Custom integrations',
          'Dedicated support',
          'Advanced security',
          'Custom analytics'
        ]
      }
    ];
    
    res.json({
      success: true,
      data: { plans }
    });
  } catch (error) {
    next(error);
  }
});

export default router;