"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const zod_1 = require("zod");
const appError_1 = require("../error/appError");
const jsonwebtoken_1 = require("jsonwebtoken");
const errorMiddleware = (error, _req, res, _next) => {
    if (error instanceof appError_1.AppError) {
        return res.status(error.statusCode).json({ error: error.message });
    }
    else if (error instanceof jsonwebtoken_1.TokenExpiredError) {
        return res.status(401).json({ error: "jwt expired" });
    }
    else if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
        return res.status(401).json({ error: "Not authorized, token failed" });
    }
    else if (error instanceof zod_1.z.ZodError) {
        return res.status(400).json({ error: error.issues[0].message });
    }
    else if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
    }
    else {
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.errorMiddleware = errorMiddleware;
