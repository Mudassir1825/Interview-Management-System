import settingsRoute from "./routes/settingsRoute.js";
import interviewRoute from "./routes/interviewRoute.js";
import express from "express";
import cors from "cors";
import db from "./config/db.js";
import authRoute from "./routes/authRoute.js";

const app = express();

app.use(cors());
app.use(express.json());

// Home
app.get("/", (req, res) => {
    res.send("Interview Management Backend is running!");
});

// Database Test
app.get("/db-test", async (req, res) => {
    try {
        await db.query("SELECT 1");
        res.send("Database connected successfully!");
    } catch (error) {
        console.error("Database connection error:", error.message);
        res.status(500).send("Database connection failed!");
    }
});

// Authentication Routes
app.use("/api", authRoute);
app.use("/api", interviewRoute);
app.use("/api", settingsRoute);
export default app;

