import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import sensorRoute from "./api/routes/sensor.js";
// import bcrypt from 'bcryptjs';
const app = express();

const connect = async () =>{
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/Database');
        console.log('Mongodb Connected..');
    } catch (error) {
        throw error;
    }
};
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB!');
});
mongoose.connection.on('disconnected',()=>{
    console.log('Mongodb disconnected...');
});

//middlewares
//for json

//Enable CORs for all routes
// const corsOptions = {
//     origin: 'http://13.126.100.44:3000',
//     optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

app.use(express.json());
//Enable CORs for all routes
app.use(cors());

app.use('/sensor',sensorRoute);

app.listen(4000,()=>{
    connect();
    console.log('Server Started..');
});