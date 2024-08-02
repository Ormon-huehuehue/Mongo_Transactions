import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"    
import connectDB from "./db/connectdb.js"
import accountRouter from "./routes/account.js"
import userRouter from "./routes/user.js"

import dotenv from "dotenv";
dotenv.config({path: './.env'});

const app = express();


app.use(cors({
    origin:"*",
    credentials: true
}))

await connectDB();

app.use(express.json())

//routes declaration 
app.use("/api/v1/user", userRouter)
app.use("/api/v1/account", accountRouter)


app.listen(3000, ()=>{
    console.log(`Server is running on port 3000`)
})