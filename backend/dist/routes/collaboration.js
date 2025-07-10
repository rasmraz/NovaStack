"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/rooms', auth_1.authenticate, async (req, res, next) => {
    try {
        res.json({
            success: true,
            message: 'Collaboration rooms coming soon!',
            data: {
                rooms: [],
                activeChats: 0
            }
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/rooms', auth_1.authenticate, async (req, res, next) => {
    try {
        const { name, startupId } = req.body;
        res.json({
            success: true,
            message: 'Room creation coming soon!',
            data: {
                roomId: 'temp-room-id',
                name,
                startupId
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=collaboration.js.map