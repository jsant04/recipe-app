import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";

import mealdbRouter from "./routes/mealdb";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 5174;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(helmet());
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(compression());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", mealdbRouter);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// 404 handler for /api routes
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Global error handler
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    const status = err.status || 500;
    res.status(status).json({ error: "Server error" });
  }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
