"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = require("express-rate-limit");
// import routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const updateProfileRoutes_1 = __importDefault(require("./routes/updateProfileRoutes"));
const drinksRoutes_1 = __importDefault(require("./routes/drinksRoutes"));
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 1 * 60 * 1000,
    limit: 100,
    message: { error: "Too many requests, please try again later" },
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(limiter);
app.use("/api/auth", authRoutes_1.default);
app.use("/api/update/profile", updateProfileRoutes_1.default);
app.use("/api/sessions", drinksRoutes_1.default);
exports.default = app;
