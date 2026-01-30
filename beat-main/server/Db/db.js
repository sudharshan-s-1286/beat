import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDb = () => {
    try {
        mongoose.connect(process.env.MONGODB_URL)
        console.log("Database connected to:", process.env.MONGODB_URL)
    } catch (err) {
        console.log(err)
    }
}

export default connectDb;