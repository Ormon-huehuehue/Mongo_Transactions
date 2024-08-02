import mongoose from "mongoose";

const DB_NAME = "PAYTM"

const connectDB  = async()=>{
    try{
        const connectionString = `${process.env.MONGODB_URL}/${DB_NAME}`;
        console.log("connectionString", connectionString)
        const {connection} = await mongoose.connect(connectionString);
        console.log(`MongoDB connected to host : ${connection.host}`)
    }
    catch(error){
        console.log({
            Error_Message : "MongoDB connection failed",
            error : error
        })
        process.exit(1);
    }
}

export default connectDB;