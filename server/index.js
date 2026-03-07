const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutesLogin.js");

dotenv.config();

const app = express();

// CORS FIRST (most important)
app.use(cors({
  origin: "http://localhost:5175",
  credentials: true
}));

// middlewares
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutesLogin);

connectDB();

app.listen(5000, () => {
  console.log("Server running on port 5000");
});