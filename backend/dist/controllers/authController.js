"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.refreshTokenEndpoint = exports.logout = exports.login = exports.register = void 0;
const db_1 = require("../config/db");
const jwt = __importStar(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = require("../utils/generateToken");
const generateRefreshToken_1 = require("../utils/generateRefreshToken");
const appError_1 = require("../error/appError");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, passwordConfirm, gender, weightKg } = req.body;
    const userExists = yield db_1.prisma.user.findUnique({
        where: { email: email },
    });
    if (userExists) {
        throw new appError_1.AppError("User already exists with this email", 400);
    }
    if (password !== passwordConfirm) {
        throw new appError_1.AppError("Passwords don't match", 400);
    }
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
    const prismaGender = gender === null || gender === void 0 ? void 0 : gender.toString().toUpperCase();
    const user = yield db_1.prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            gender: prismaGender,
            weightKg,
        },
    });
    const accessToken = (0, generateToken_1.generateToken)(user.id);
    const refreshToken = (0, generateRefreshToken_1.generateRefreshToken)(user.id);
    return res.status(201).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                name: name,
                email: email,
                gender: gender.toLocaleLowerCase(),
                weightKg: weightKg,
            },
            accessToken,
            refreshToken,
        },
    });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield db_1.prisma.user.findUnique({
        where: { email: email },
    });
    if (!user) {
        throw new appError_1.AppError("Invalid email or password", 401);
    }
    const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new appError_1.AppError("Invalid email or password", 401);
    }
    const accessToken = (0, generateToken_1.generateToken)(user.id);
    const refreshToken = (0, generateRefreshToken_1.generateRefreshToken)(user.id);
    return res.status(201).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: email,
                gender: user.gender.toLocaleLowerCase(),
                weightKg: user.weightKg,
            },
            accessToken,
            refreshToken,
        },
    });
});
exports.login = login;
const refreshTokenEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        throw new appError_1.AppError("Refresh token required", 401);
    }
    const secret = process.env.APP_ENV === "production"
        ? process.env.JWT_TOKEN_SECRET
        : process.env.JWT_TOKEN_SECRET_STAGING;
    if (!secret)
        throw new appError_1.AppError("REFRESH_TOKEN_SECRET not found", 401);
    const decoded = jwt.verify(refreshToken, secret);
    const user = yield db_1.prisma.user.findUnique({
        where: { id: decoded.id },
    });
    if (!user) {
        throw new appError_1.AppError("User no longer exists", 401);
    }
    const accessToken = (0, generateToken_1.generateToken)(decoded.id);
    return res.json({
        status: "success",
        data: {
            accessToken,
        },
    });
});
exports.refreshTokenEndpoint = refreshTokenEndpoint;
const logout = (_req, res) => {
    // logout is handled on the client by deleting tokens
    return res.status(200).json({
        status: "success",
        message: "Logged out successfully",
    });
};
exports.logout = logout;
