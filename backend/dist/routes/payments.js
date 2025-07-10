"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const router = express_1.default.Router();
const stripe = process.env.STRIPE_SECRET_KEY ? new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-06-30.basil'
}) : null;
router.post('/create-payment-intent', auth_1.authenticate, async (req, res, next) => {
    try {
        if (!stripe) {
            throw (0, errorHandler_1.createError)('Payment processing not configured', 500);
        }
        if (!req.user) {
            throw (0, errorHandler_1.createError)('Authentication required', 401);
        }
        const { amount, currency = 'usd', startupId } = req.body;
        if (!amount || amount < 100) {
            throw (0, errorHandler_1.createError)('Minimum amount is $1.00', 400);
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency,
            metadata: {
                userId: req.user._id.toString(),
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
    }
    catch (error) {
        next(error);
    }
});
router.post('/create-subscription', auth_1.authenticate, async (req, res, next) => {
    try {
        if (!stripe) {
            throw (0, errorHandler_1.createError)('Payment processing not configured', 500);
        }
        if (!req.user) {
            throw (0, errorHandler_1.createError)('Authentication required', 401);
        }
        const { priceId } = req.body;
        if (!priceId) {
            throw (0, errorHandler_1.createError)('Price ID is required', 400);
        }
        let customerId = req.user.stripeCustomerId;
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: req.user.email,
                name: `${req.user.firstName} ${req.user.lastName}`,
                metadata: {
                    userId: req.user._id.toString()
                }
            });
            customerId = customer.id;
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
                clientSecret: subscription.latest_invoice?.payment_intent?.client_secret
            }
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/webhook', express_1.default.raw({ type: 'application/json' }), async (req, res, next) => {
    try {
        if (!stripe) {
            throw (0, errorHandler_1.createError)('Payment processing not configured', 500);
        }
        const sig = req.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!endpointSecret) {
            throw (0, errorHandler_1.createError)('Webhook secret not configured', 500);
        }
        let event;
        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        }
        catch (err) {
            throw (0, errorHandler_1.createError)('Webhook signature verification failed', 400);
        }
        switch (event.type) {
            case 'payment_intent.succeeded':
                console.log('Payment succeeded:', event.data.object);
                break;
            case 'invoice.payment_succeeded':
                console.log('Subscription payment succeeded:', event.data.object);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        res.json({ received: true });
    }
    catch (error) {
        next(error);
    }
});
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
                priceId: 'price_pro_monthly',
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
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=payments.js.map