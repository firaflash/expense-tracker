import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.use('/',(req,res)=>{
    res.json({
        status:200,
        message:"App Started Listing to root"
    })
})

export default app;