import express from "express"
import 'dotenv/config'
import connectDB from "./database/db.js"
import userRoute from "./routes/userRoutes.js"
import adminRoute from "./routes/adminRoutes.js"
import exhibitorRoute from "./routes/exhibitorRoutes.js"
import attendeeRoute from "./routes/attendeeRoutes.js"
import cors from "cors"

const app = express()
const PORT = process.env.PORT || 5000
app.use(express.json())
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use("/admin", adminRoute)
app.use('/user',userRoute)
app.use("/exhibitor", exhibitorRoute)
app.use("/attendee", attendeeRoute)
app.listen(PORT, ()=>{
    connectDB()
    console.log(`Server is listening on Port number: ${PORT}`)
})