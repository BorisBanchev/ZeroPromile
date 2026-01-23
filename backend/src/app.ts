import express from "express";
import cookieParser from "cookie-parser";

// import routes
import authRoutes from "./routes/authRoutes";
import genderRoutes from "./routes/genderRoutes";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/gender", genderRoutes);

export default app;
