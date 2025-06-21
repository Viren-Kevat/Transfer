require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db"); // Import the connection function from db.js
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const paymentsRoutes = require("./routes/payments"); // Import payments routes

// database connection
connection();

// middlewares
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentsRoutes); // Use payments routes

const port = process.env.PORT || 8081;
app.listen(port, console.log(`Listening on port ${port}...`));
