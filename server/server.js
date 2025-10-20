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


app.use('/api/v1/healthcheck',healthCheckRouter);
app.use('/api/v1/auth', authRouter);
const PORT= process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`Server is running on port no ${PORT}`)
})