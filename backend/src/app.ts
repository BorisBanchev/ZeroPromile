import express from "express";
import cookieParser from "cookie-parser";

// import routes
import authRoutes from "./routes/authRoutes";
import updateProfileRoutes from "./routes/updateProfileRoutes";
import drinksRoutes from "./routes/drinksRoutes";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/update/profile", updateProfileRoutes);
app.use("/api/sessions", drinksRoutes);

export default app;
