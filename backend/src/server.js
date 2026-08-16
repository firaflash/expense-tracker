import app from './app.js'
import dotenv from 'dotenv';
import connectDB from './config/db.js'
dotenv.config();

const PORT = process.env.PORT || 3000;


const serverStart = async () =>{
    try{
        console.log("Server Starting ");
        await connectDB();
        app.listen(PORT , () =>{
            console.log(`App listing on https://localhost:${PORT}/`)  
        })        
    }catch(e){
        console.log("Error message When starting server", e.message)
    }
}

serverStart();