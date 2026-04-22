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
const dotenv_1 = require("dotenv");
const db_1 = require("./config/db");
const app_1 = __importDefault(require("./app"));
(0, dotenv_1.config)();
const port = Number(process.env.PORT) || 3001;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.connectDB)();
});
start().catch((err) => {
    var _a;
    console.error("Startup error:", err instanceof Error ? ((_a = err.stack) !== null && _a !== void 0 ? _a : err.message) : String(err));
});
const server = app_1.default.listen(port, () => {
    console.log(`Server running on port:${port}`);
});
// Handle unhandled promise rejections (database connection errors)
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    server.close(() => {
        void (0, db_1.disconnectDB)().then(() => process.exit(1));
    });
});
// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    server.close(() => {
        void (0, db_1.disconnectDB)().then(() => process.exit(1));
    });
});
// Graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(() => {
        void (0, db_1.disconnectDB)().then(() => process.exit(0));
    });
});
