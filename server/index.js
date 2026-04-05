import { setDefaultResultOrder, setServers } from 'dns';
setDefaultResultOrder('ipv4first');


setServers(['8.8.8.8', '8.8.4.4']);
import { config } from "dotenv";
import dotenv from 'dotenv'
dotenv.config();

import express, { json } from "express";
import cors from "cors";


import connectDB from "./config/db.js";
import authRoutes from "./routes/donorRoutes.js";
import authRoutesLogin from "./routes/authRoutesLogin.js";
import userRoutes from "./routes/user.js";
import eligibilityRoutes from "./routes/eligibilityRoutes.js"; 
import donorRoutes from "./routes/donorRoutes.js"; 
import authRoutesRegister from "./routes/authRoutesRegister.js";
import bloodRequestRoutes from "./routes/bloodRequestRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
config();

const app = express();

connectDB();



app.use(cors({
  origin: "http://localhost:5175",
  credentials: true
}));
app.use(json());


app.use("/api/auth", authRoutesLogin);
app.use("/api/user", userRoutes);
app.use("/api/eligibility", eligibilityRoutes); 
app.use("/api/donors", donorRoutes); 
app.use("/api/auth", authRoutesRegister);
app.use("/api/requests", bloodRequestRoutes);

app.use("/api/chat", chatRoutes);
app.listen(5000, () => {
  console.log("Server running on port 5000");
});