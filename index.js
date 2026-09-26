import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

// Connect to DB (graceful, non-blocking)
databaseConnection();

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Enable CORS for API consumers
app.use(cors({
  origin: true,
  credentials: true
}));

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/tweet", tweetRoute);
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Twitter Clone",
    uptime: process.uptime()
  });
});

// Serve static frontend assets built to 'dist'
app.use(express.static(path.join(__dirname, "dist")));

// SPA fallback for React client-side routing
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API route not found", success: false });
  }
  const indexPath = path.join(__dirname, "dist", "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Twitter Clone</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #000; color: #fff; text-align: center; }
            .card { background: #16181c; padding: 2rem 3rem; border-radius: 16px; border: 1px solid #2f3336; max-width: 480px; }
            h1 { font-size: 1.5rem; margin-bottom: 0.5rem; color: #1d9bf0; }
            p { color: #71767b; font-size: 0.95rem; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Twitter Clone Loading...</h1>
            <p>Frontend assets are compiling. Please refresh in a moment.</p>
          </div>
        </body>
        </html>
      `);
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  return res.status(500).json({ error: err.message || "Internal Server Error", success: false });
});

// Start Server on 0.0.0.0 and port 3000
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening at http://0.0.0.0:${PORT}`);
});
