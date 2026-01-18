import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db";
import app from "./app";

config();

const port: number = Number(process.env.PORT) || 3001;

const start = async () => {
  await connectDB();
};
start().catch((err) => {
  console.error(
    "Startup error:",
    err instanceof Error ? (err.stack ?? err.message) : String(err),
  );
});

const server = app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

// Handle unhandled promise rejections (database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(() => {
    void disconnectDB().then(() => process.exit(1));
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  server.close(() => {
    void disconnectDB().then(() => process.exit(1));
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    void disconnectDB().then(() => process.exit(0));
  });
});
