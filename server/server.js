import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import * as Sentry from "@sentry/node";
import { clerkWebHook } from "./controllers/webhook.js";

const app = express();
await connectDB();

app.use(cors());

// Webhook route with raw parser
app.post("/webhooks", express.raw({ type: "application/json" }), clerkWebHook);

// Other routes
app.get("/", (req, res) => res.send("API is Working"));

Sentry.setupExpressErrorHandler(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
