import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send("Fetching all users!");
});

router.post("/", (_req, res) => {
  res.send("Register a user!");
});

router.get("/:id", (req, res) => {
  res.send(`Fetching a single user with id: ${req.params.id}`);
});

export default router;
