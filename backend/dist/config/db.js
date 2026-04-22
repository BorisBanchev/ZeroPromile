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
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = exports.prisma = void 0;
require("dotenv/config");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("../generated/prisma/client");
const connectionString = process.env.DATABASE_URL;
const adapter = new adapter_pg_1.PrismaPg({ connectionString });
const prisma = new client_1.PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
});
exports.prisma = prisma;
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.$connect();
        console.log("DB connected via Prisma!");
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Database connection error: ${error.message}`);
        }
        else {
            console.error(`Database connection error: ${String(error)}`);
        }
        if (process.env.NODE_ENV !== "test") {
            process.exit(1);
        }
        throw error;
    }
});
exports.connectDB = connectDB;
const disconnectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
});
exports.disconnectDB = disconnectDB;
