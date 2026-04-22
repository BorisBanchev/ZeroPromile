"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newUpdateProfileSchema = void 0;
const zod_1 = require("zod");
const user_1 = require("../types/user");
exports.newUpdateProfileSchema = zod_1.z.object({
    gender: zod_1.z.enum(user_1.Gender, "Invalid gender: Must be either male or female"),
    weight: zod_1.z
        .number()
        .positive("Weight must be a positive number")
        .lt(1000, "Weight must be at most 1000kg"),
});
