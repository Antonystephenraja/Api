import express from "express";
import { login, signup,InsertData,readLimitMain,read,readSensorGraph} from "../controllers/sensor.js";

const router = express.Router();

//register
router.post('/signup',signup);
router.post('/login',login);
router.get('/InsertData',InsertData);
router.get('/readLimitMain',readLimitMain); 
router.get('/read',read);
router.get('/readSensor/:sensorId',readSensorGraph); 

export default router;