import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './src/config/DB.js'

const app= express()
app.use(express.json());

//connect database
await connectDB()


app.get('/',(req,res)=>
  res.send("Api is working")
)

import healthCheckRouter from './src/routes/healthCheck.routes.js'
import authRouter from './src/routes/auth.routes.js'
import farmerRoutes from "./src/routes/farmer.routes.js";
import consumerRoutes from "./src/routes/consumer.route.js"
import commonRoutes from "./src/routes/common.routes.js"
import adminRoutes from './src/routes/admin.routes.js'

app.use('/api/v1/healthcheck',healthCheckRouter);
app.use('/api/v1/auth', authRouter);
app.use("/api/v1/farmer", farmerRoutes);
app.use("/api/v1/consumer",consumerRoutes)
app.use("/api/v1/common",commonRoutes)
app.use("/api/v1/admin",adminRoutes)
const PORT= process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`Server is running on port no ${PORT}`)
})