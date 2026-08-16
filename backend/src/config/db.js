import { mongoose } from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();

const connectDB  = async () =>{
    try{
        const URL =  process.env.MONGODB_URI;
        console.log(URL)
        if(!URL){
            throw('No Connection URL')
            return
        }
        const conn = await mongoose.connect(URL);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);


    }catch(e){
        return {
            status: 404,
            message: e.message,
            descripition: "Error With Connection Creation"
        }
    }
}

export default connectDB;