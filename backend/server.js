import express from "express"
import 'dotenv/config'
import connectDB from "./database/db.js"
import userRoute from "./routes/userRoutes.js"
const app = express()
const PORT = process.env.PORT || 5000
app.use(express.json())
app.use('/user',userRoute)
app.listen(PORT, ()=>{
    connectDB()
    console.log('Server is listening on Port number: ${PORT}')
})