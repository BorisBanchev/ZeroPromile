"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newUserEntrySchema = void 0;
const zod_1 = require("zod");
exports.newUserEntrySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.email("Invalid email!"),
    password: zod_1.z
        .string()
        .min(8, "Password is too short, legth must be at least 8 characters long")
        .max(30, "Password is too long, length must be at most 30 characters!"),
    gender: zod_1.z.enum(["male", "female"], "Invalid gender: must be either male or female"),
    weightKg: zod_1.z
        .number("Weight must be a positive number")
        .positive("Weight must be a positive number"),
});
