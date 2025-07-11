import express from 'express';
import Stripe from 'stripe';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { getMoneroWallet } from '../services/monero';
import { logger } from '../utils/logger';

const router = express.Router();

// Initialize Stripe (will need STRIPE_SECRET_KEY in env)
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil'
}) : null;

// Get Monero wallet instance
const moneroWallet = getMoneroWallet();

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
    } catch {
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

// ===== MONERO PAYMENT ENDPOINTS =====

// Create Monero address for user
router.post('/create-monero-address', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Authentication required', 401);
    }
    
    const userId = (req.user._id as any).toString();
    const address = await moneroWallet.createUserWallet(userId);
    
    res.json({
      success: true,
      data: {
        address: address.address,
        addressIndex: address.addressIndex,
        currency: 'XMR'
      }
    });
  } catch (error) {
    logger.error('Monero address creation failed:', error);
    next(createError('Failed to create Monero address', 500));
  }
});

// Get Monero wallet balance
router.get('/monero-balance', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const balance = await moneroWallet.getBalance();
    
    res.json({
      success: true,
      data: {
        balance: balance.balance,
        unlockedBalance: balance.unlockedBalance,
        currency: 'XMR'
      }
    });
  } catch (error) {
    logger.error('Monero balance retrieval failed:', error);
    next(createError('Failed to retrieve Monero balance', 500));
  }
});

// Process Monero investment
router.post('/invest-monero', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Authentication required', 401);
    }
    
    const { startupId, amount, toAddress } = req.body;
    const userId = (req.user._id as any).toString();

    if (!startupId || !amount || !toAddress) {
      throw createError('Missing required fields: startupId, amount, toAddress', 400);
    }

    if (amount <= 0) {
      throw createError('Amount must be greater than 0', 400);
    }

    // Validate Monero address
    const isValidAddress = await moneroWallet.validateAddress(toAddress);
    if (!isValidAddress) {
      throw createError('Invalid Monero address', 400);
    }

    // Get user's address (assuming they have one)
    const userAddress = await moneroWallet.getAddress(0, 0);

    // Process the investment
    const result = await moneroWallet.processInvestment(
      userAddress.address,
      toAddress,
      amount,
      startupId
    );

    logger.info(`Monero investment processed: User ${userId} invested ${amount} XMR in startup ${startupId}`);
    
    res.json({
      success: true,
      data: {
        txHash: result.txHash,
        txKey: result.txKey,
        amount: result.amount,
        fee: result.fee,
        startupId,
        currency: 'XMR'
      }
    });
  } catch (error) {
    logger.error('Monero investment processing failed:', error);
    next(createError('Failed to process Monero investment', 500));
  }
});

// Get Monero transaction history
router.get('/monero-history', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const transfers = await moneroWallet.getTransfers();
    
    res.json({
      success: true,
      data: {
        transfers: transfers.map(transfer => ({
          txHash: transfer.txid,
          amount: transfer.amount,
          fee: transfer.fee || 0,
          height: transfer.height,
          timestamp: transfer.timestamp,
          type: transfer.type,
          address: transfer.address,
          paymentId: transfer.payment_id,
          confirmations: transfer.confirmations
        })),
        currency: 'XMR'
      }
    });
  } catch (error) {
    logger.error('Monero history retrieval failed:', error);
    next(createError('Failed to retrieve Monero transaction history', 500));
  }
});

// Get investment history for a specific startup
router.get('/startup-investments/:startupId', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { startupId } = req.params;
    const investments = await moneroWallet.getInvestmentHistory(startupId);
    
    res.json({
      success: true,
      data: {
        startupId,
        investments: investments.map(investment => ({
          txHash: investment.txid,
          amount: investment.amount,
          timestamp: investment.timestamp,
          confirmations: investment.confirmations,
          currency: 'XMR'
        }))
      }
    });
  } catch (error) {
    logger.error('Startup investment history retrieval failed:', error);
    next(createError('Failed to retrieve startup investment history', 500));
  }
});

// Validate Monero address
router.post('/validate-monero-address', async (req, res, next) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      throw createError('Address is required', 400);
    }
    
    const isValid = await moneroWallet.validateAddress(address);
    
    res.json({
      success: true,
      data: {
        address,
        valid: isValid,
        currency: 'XMR'
      }
    });
  } catch (error) {
    logger.error('Monero address validation failed:', error);
    next(createError('Failed to validate Monero address', 500));
  }
});

// Get current Monero network height
router.get('/monero-height', async (req, res, next) => {
  try {
    const height = await moneroWallet.getHeight();
    
    res.json({
      success: true,
      data: {
        height,
        currency: 'XMR'
      }
    });
  } catch (error) {
    logger.error('Monero height retrieval failed:', error);
    next(createError('Failed to retrieve Monero network height', 500));
  }
});

// Refresh wallet (sync with blockchain)
router.post('/refresh-monero-wallet', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const blocksFetched = await moneroWallet.refresh();
    
    res.json({
      success: true,
      data: {
        blocksFetched,
        message: 'Wallet refreshed successfully'
      }
    });
  } catch (error) {
    logger.error('Monero wallet refresh failed:', error);
    next(createError('Failed to refresh Monero wallet', 500));
  }
});

export default router;