import express from "express";
import dotenv from "dotenv"
import cors from "cors"


const PORT= process.env.PORT || 5000;
const app = express();
const urlOrigns = ['http://localhost:5173', 'http://localhost:3000']
const corsConfig={
    origin:urlOrigns
}
app.use(cors())
app.use(express.json())
app.use(cors(corsConfig))


app.listen(PORT , () =>{
    console.log(`App listing on https://localhost:${PORT}/` )
})



app.get('/',(req,res)=>{
     res.json({
        success: true,
        message: "Expense Tracker API is running"
    });
})

app.post('/hello',(req,res)=>{
     res.json({
        success: true,
        message: "Post world "
    });
})
app.get('/hello',(req,res)=>{
     res.json({
        success: true,
        message: "Hello World "
    });
})

export default app;
