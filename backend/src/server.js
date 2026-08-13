import express from "express";
import dotenv from "dotenv"
import cors from "cors"


const PORT= process.env.PORT || 5000;
const app = express();

app.use(cors())
