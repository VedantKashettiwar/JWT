const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const app = express()

//Db connection 
const connectDb = require("./config/connectdb")
connectDb()


const userRoutes = require("./routes/user")

//JSON Middleware
app.use(express.json())

//Load Routes
app.use("/api/user",userRoutes)

app.listen(8000,()=>{
    console.log(`Server Running At Port No 8000`)
})