"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const appError_1 = require("../error/appError");
const authMiddleware = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let token = null;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    else if ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        throw new appError_1.AppError("Not authorized, no token provided", 401);
    }
    const secret = process.env.APP_ENV === "production"
        ? process.env.JWT_TOKEN_SECRET
        : process.env.JWT_TOKEN_SECRET_STAGING;
    if (!secret)
        throw new appError_1.AppError("Internal server error", 500);
    const decoded = jsonwebtoken_1.default.verify(token, secret);
    const user = yield db_1.prisma.user.findUnique({
        where: { id: decoded.id },
    });
    if (!user) {
        throw new appError_1.AppError("User no longer exists", 401);
    }
    req.user = user;
    next();
});
exports.authMiddleware = authMiddleware;
