"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const monero_1 = require("../services/monero");
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
const stripe = process.env.STRIPE_SECRET_KEY ? new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-06-30.basil'
}) : null;
const moneroWallet = (0, monero_1.getMoneroWallet)();
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
        catch {
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
router.post('/create-monero-address', auth_1.authenticate, async (req, res, next) => {
    try {
        if (!req.user) {
            throw (0, errorHandler_1.createError)('Authentication required', 401);
        }
        const userId = req.user._id.toString();
        const address = await moneroWallet.createUserWallet(userId);
        res.json({
            success: true,
            data: {
                address: address.address,
                addressIndex: address.addressIndex,
                currency: 'XMR'
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Monero address creation failed:', error);
        next((0, errorHandler_1.createError)('Failed to create Monero address', 500));
    }
});
router.get('/monero-balance', auth_1.authenticate, async (req, res, next) => {
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
    }
    catch (error) {
        logger_1.logger.error('Monero balance retrieval failed:', error);
        next((0, errorHandler_1.createError)('Failed to retrieve Monero balance', 500));
    }
});
router.post('/invest-monero', auth_1.authenticate, async (req, res, next) => {
    try {
        if (!req.user) {
            throw (0, errorHandler_1.createError)('Authentication required', 401);
        }
        const { startupId, amount, toAddress } = req.body;
        const userId = req.user._id.toString();
        if (!startupId || !amount || !toAddress) {
            throw (0, errorHandler_1.createError)('Missing required fields: startupId, amount, toAddress', 400);
        }
        if (amount <= 0) {
            throw (0, errorHandler_1.createError)('Amount must be greater than 0', 400);
        }
        const isValidAddress = await moneroWallet.validateAddress(toAddress);
        if (!isValidAddress) {
            throw (0, errorHandler_1.createError)('Invalid Monero address', 400);
        }
        const userAddress = await moneroWallet.getAddress(0, 0);
        const result = await moneroWallet.processInvestment(userAddress.address, toAddress, amount, startupId);
        logger_1.logger.info(`Monero investment processed: User ${userId} invested ${amount} XMR in startup ${startupId}`);
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
    }
    catch (error) {
        logger_1.logger.error('Monero investment processing failed:', error);
        next((0, errorHandler_1.createError)('Failed to process Monero investment', 500));
    }
});
router.get('/monero-history', auth_1.authenticate, async (req, res, next) => {
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
    }
    catch (error) {
        logger_1.logger.error('Monero history retrieval failed:', error);
        next((0, errorHandler_1.createError)('Failed to retrieve Monero transaction history', 500));
    }
});
router.get('/startup-investments/:startupId', auth_1.authenticate, async (req, res, next) => {
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
    }
    catch (error) {
        logger_1.logger.error('Startup investment history retrieval failed:', error);
        next((0, errorHandler_1.createError)('Failed to retrieve startup investment history', 500));
    }
});
router.post('/validate-monero-address', async (req, res, next) => {
    try {
        const { address } = req.body;
        if (!address) {
            throw (0, errorHandler_1.createError)('Address is required', 400);
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
    }
    catch (error) {
        logger_1.logger.error('Monero address validation failed:', error);
        next((0, errorHandler_1.createError)('Failed to validate Monero address', 500));
    }
});
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
    }
    catch (error) {
        logger_1.logger.error('Monero height retrieval failed:', error);
        next((0, errorHandler_1.createError)('Failed to retrieve Monero network height', 500));
    }
});
router.post('/refresh-monero-wallet', auth_1.authenticate, async (req, res, next) => {
    try {
        const blocksFetched = await moneroWallet.refresh();
        res.json({
            success: true,
            data: {
                blocksFetched,
                message: 'Wallet refreshed successfully'
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Monero wallet refresh failed:', error);
        next((0, errorHandler_1.createError)('Failed to refresh Monero wallet', 500));
    }
});
exports.default = router;
//# sourceMappingURL=payments.js.map