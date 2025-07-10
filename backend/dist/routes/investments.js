"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const router = express_1.default.Router();
router.get('/', auth_1.authenticate, async (req, res, next) => {
    try {
        res.json({
            success: true,
            message: 'Investment tracking coming soon!',
            data: {
                investments: [],
                totalInvested: 0,
                activeInvestments: 0
            }
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/invest', auth_1.authenticate, async (req, res, next) => {
    try {
        const { startupId, amount, terms } = req.body;
        if (!startupId || !amount) {
            throw (0, errorHandler_1.createError)('Startup ID and amount are required', 400);
        }
        if (amount < 100) {
            throw (0, errorHandler_1.createError)('Minimum investment amount is $100', 400);
        }
        res.json({
            success: true,
            message: 'Investment processing coming soon!',
            data: {
                startupId,
                amount,
                status: 'pending'
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=investments.js.map