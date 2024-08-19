import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dbConnection from './dbConfig/index.js';
import routes from './routes/userRoute.js';

dotenv.config();

const app=express();
const port =process.env.PORT;

dbConnection();
app.use(express.json());
app.use(cors());

app.use(routes);
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});