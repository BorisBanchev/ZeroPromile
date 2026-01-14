import express from "express";
import usersRouter from "./routes/users";

const port: number = Number(process.env.PORT) || 3000;

const app = express();

app.use(express.json());
app.use("/api/users", usersRouter);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
