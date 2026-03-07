const dns = require('dns');
dns.setDefaultResultOrder('ipv4first'); 


dns.setServers(['8.8.8.8', '8.8.4.4']);
const dotenv = require("dotenv");

const express = require("express");
const cors = require("cors");


const connectDB = require("./config/db");
const authRoutes = require("./routes/donorRoutes");



dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});