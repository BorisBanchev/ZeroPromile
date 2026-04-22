"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newSessionSchema = void 0;
const zod_1 = require("zod");
exports.newSessionSchema = zod_1.z.object({
    sessionName: zod_1.z.string().min(1, "Session name is required"),
});
