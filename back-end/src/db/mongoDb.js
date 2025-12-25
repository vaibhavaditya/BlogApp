import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        const connectionIns = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`MongoDB connected !! DB HOST: ${connectionIns.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection failed", error);
    }
}

export {connectDB}