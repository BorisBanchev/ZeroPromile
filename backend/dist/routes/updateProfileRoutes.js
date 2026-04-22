"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const updateUserProfileController_1 = require("../controllers/updateUserProfileController");
const newUpdateProfileMiddleware_ts_1 = require("../middlewares/newUpdateProfileMiddleware.ts");
const errorMiddleware_1 = require("../middlewares/errorMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authMiddleware);
router.patch("/", newUpdateProfileMiddleware_ts_1.newUpdateProfileParser, updateUserProfileController_1.setGenderAndWeight);
router.use(errorMiddleware_1.errorMiddleware);
exports.default = router;
