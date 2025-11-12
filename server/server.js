import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import connectDB from "./src/config/DB.js";
import productRoutes from "./src/routes/product.routes.js";
import authRouter from "./src/routes/auth.routes.js";
import farmerRoutes from "./src/routes/farmer.routes.js";
import consumerRoutes from "./src/routes/consumer.route.js";
import commonRoutes from "./src/routes/common.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import orderRoutes from "./src/routes/order.routes.js"
import  messageRoutes from "./src/routes/message.routes.js"
const app = express();
app.use(express.json());
app.use(cors());
// 🔥 BULLETPROOF ERROR HANDLING
app.use((err, req, res, next) => {
  console.error("❌ GLOBAL ERROR:", err);
  res.status(500).json({ 
    success: false, 
    message: err.message || "Internal Server Error" 
  });
});
// connect to DB
await connectDB();

app.get("/", (req, res) => res.send("API is working"));

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/farmer", farmerRoutes);
app.use("/api/v1/consumer", consumerRoutes);
app.use("/api/v1/common", commonRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/orders",orderRoutes)
app.use("/api/v1/messages", messageRoutes)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
