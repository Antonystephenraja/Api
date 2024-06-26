import express from "express";
import { login, signup,InsertData,readLimitMain,read,readSensorGraph,
    BPCL,BPCL_READ,insertProjectData,BPCL_TOF_INSERT,BPCL_ASCAN_CLEAR,Creating_project,leveldata,
    displayProjectData, levelinsert,levelchartdata,displayProjectDataLimit,levelexceldata,DisplayAllData,
    displayProjectReportData
} from "../controllers/sensor.js";

const router = express.Router();

//register
router.post('/signup',signup);
router.post('/login',login);
router.get('/InsertData',InsertData);
router.get('/readLimitMain',readLimitMain); 
router.get('/read',read);
router.get('/readSensor/:sensorId',readSensorGraph);
router.get('/insertProjectData',insertProjectData);

//BPCL
router.get('/XYMA_BPCL',BPCL)
router.get('/BPCL_READ',BPCL_READ)
router.get('/BPCL_TOF_INSERT',BPCL_TOF_INSERT)
router.post('/BPCL_ASCAN_CLEAR',BPCL_ASCAN_CLEAR)
router.post('/Creating_project',Creating_project);
router.post('/displayProjectDataLimit',displayProjectDataLimit);
router.get('/displayProjectData',displayProjectData);
router.get('/DisplayProjectReport',displayProjectReportData)
router.get('/project_all_data',DisplayAllData);
//level mobile application
router.get('/levelinsert', levelinsert)
router.get('/leveldata/:id', leveldata)
router.get('/levelchartdata/:sensorId/:dataField', levelchartdata)
router.get('/levelexceldata', levelexceldata)



export default router;

