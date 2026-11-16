
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { connectDB } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Task Management API is Running Successfully!");
});

app.use("/api/tasks", require("./routes/taskRoutes"));

const PORT = 5000;

async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
            console.log("SQL Server connected successfully!");
        });
    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
}

startServer();
