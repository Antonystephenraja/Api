import express from "express";
import multer from "multer";
import {
  login,
  signup,
  InsertData,
  readLimitMain,
  read,
  readSensorGraph,
  BPCL,
  BPCL_READ,
  insertProjectData,
  BPCL_TOF_INSERT,
  BPCL_ASCAN_CLEAR,
  Creating_project,
  leveldata,
  displayProjectData,
  levelinsert,
  levelchartdata,
  displayProjectDataLimit,
  levelexceldata,
  DisplayAllData,
  contacts,
  subscription,
  Check,
  adminSignup,
  adminLogin,
  validateToken,
  addPosition,
  getPosition,
  deletePosition,
  updatePosition,
  uploadApplicationForm,
  getApplicationForm,
  displayProjectReportData,
  ASCAN_PROJECT_ADD,
  ASCAN_PROJECT_LIST,
  ASCAN_PROJECT_DELETE,
  SETTINGS_PAGE,
  insertHindalcoData,
  addXymaClients,
  getXymaClients,
} from "../controllers/sensor.js";
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//register
router.post("/signup", signup);
router.post("/login", login);
router.get("/InsertData", InsertData);
router.get("/readLimitMain", readLimitMain);
router.get("/read", read);
router.get("/readSensor/:sensorId", readSensorGraph);
router.get("/insertProjectData", insertProjectData);

//Website Server
router.post("/contacts", contacts);
router.post("/subscription", subscription);
router.get("/check", Check);
router.get("/adminsignup", adminSignup);
router.post("/adminlogin", adminLogin);
router.post("/validatetoken", validateToken);
router.post("/addposition", addPosition);
router.get("/getposition", getPosition);
router.delete("/deleteposition/:id", deletePosition);
router.put("/updateposition/:id", updatePosition);
router.post(
  "/uploadapplicationform",
  upload.single("file"),
  uploadApplicationForm
);
router.get("/getapplicationform", getApplicationForm);

//BPCL
router.get("/XYMA_BPCL", BPCL);
router.get("/BPCL_READ", BPCL_READ);
router.get("/BPCL_TOF_INSERT", BPCL_TOF_INSERT);
router.post("/BPCL_ASCAN_CLEAR", BPCL_ASCAN_CLEAR);
router.post("/Creating_project", Creating_project);
router.post("/displayProjectDataLimit", displayProjectDataLimit);
router.get("/displayProjectData", displayProjectData);
router.get("/DisplayProjectReport", displayProjectReportData);
router.get("/project_all_data", DisplayAllData);
router.post("/ASCAN_PROJECT_ADD", ASCAN_PROJECT_ADD);
router.get("/ASCAN_PROJECT_LIST", ASCAN_PROJECT_LIST);
router.post("/ASCAN_PROJECT_DELETE", ASCAN_PROJECT_DELETE);
router.post("/SETTINGS_PAGE", SETTINGS_PAGE);

//level mobile application
router.get("/levelinsert", levelinsert);
router.get("/leveldata/:id", leveldata);
router.get("/levelchartdata/:sensorId/:dataField", levelchartdata);
router.get("/levelexceldata", levelexceldata);

//Backup Datas
router.get("/insertHindalcoData", insertHindalcoData);

//Xyma clients
router.post("/addXymaClients", upload.single("clientLogo"), addXymaClients);
router.get("/getXymaClients", getXymaClients);

export default router;
