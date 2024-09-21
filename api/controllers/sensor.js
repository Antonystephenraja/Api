import bpclModel from '../model/bpclModel.js';
import bpcl_tof_insert from '../model/bpcl_tof_insert.js';
import Data from '../model/sensorModel.js'
import EmployeeModel from '../model/userModel.js'
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import mongoose from 'mongoose';
import levelmodel from '../model/levelmodel.js'
import nodemailer from "nodemailer";
import AdminInfoModel from '../model/AdminInfoSchema.js';
import PositionModel from '../model/PositionSchema.js';
import ApplicationFormModel from '../model/ApplicationFormSchema.js';

//Register
export const signup =async (req,res) =>
{
    try{
        const {project,userid,password} = req.body;
       // console.log("project name",project,userid,password)
        const newPassword = await bcrypt.hash(password, 10);
        await EmployeeModel.create({
            Project:project,
            Email:userid,
            Password:newPassword,
        })

        res.status(200).json({ message: "Password received successfully" });
    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
   

    // .then(hash => 
    //     {
    //         EmployeeModel.create({Project,Email,Password: hash})
    //         .then(employees => res.json(employees))
    //         .catch(err => res.json(err))
    //     })
    // .catch(err => console.log(err.message))
    
};

//login
export const login = (req,res) =>
{
    const {Project,Email, Password} = req.body;

    EmployeeModel.findOne({Project: Project,Email: Email})
    .then(user =>
        {
            if(user)
            {
                bcrypt.compare(Password, user.Password, (err, response) =>
                {
                    if(response)
                    {
                        let redirectUrl = '';
                        if(user.Project === 'SKF')
                        {
                            redirectUrl = 'SKF';
                        }
                        else if(user.Project === 'admin')
                        {
                            redirectUrl = 'ADMIN'
                        }
                        else if(user.Project === 'BPCL')
                        {
                            redirectUrl = 'BPCL'
                        }
                        // token generation
                        const token = jwt.sign({Email: user.Email}, "jwt-secret-key", {expiresIn:"1d"})
                        // role assignment
                        let role='';
                        if(user.Email === 'admin@xyma.in')
                        {
                            role = 'admin';
                        }
                        else if(user.Email !== 'admin@xyma.in')
                        {
                            role = 'client';
                        }
                        res.json({token : token, role: role, redirectUrl: redirectUrl}); 
                    }
                    else
                    {
                        res.json("Incorrect Password")
                    }
                })
            } 
            else
            {
                res.json("invalid user")
            }
        })
        .catch(err => console.log(err));
};


export const InsertData = async (req, res) => {
    const { sensor1, sensor2, sensor3, sensor4, sensor5, other, timestamp } = req.query;
    if (!sensor1 || !sensor2 || !sensor3 || !sensor4 || !sensor5 || !other || !timestamp) {
        return res.status(400).json({ error: "Missing required parameters" });
    }
    try {
        const newData = {
            sensor1: sensor1,
            sensor2: sensor2,
            sensor3: sensor3,
            sensor4: sensor4,
            sensor5: sensor5,
            other: other,
            timestamp: timestamp,
        };
        await bpcl_tof_insert.create(newData); // Use Data instead of sensor
        res.status(200).json({ message: "Data inserted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


//jeffery code

export const readLimitMain =  async(req,res) =>
{
    const id= req.params.id;

    const data = await Data.find().sort({_id: -1}).limit(30);
    
    if (data) {
        res.json({ success: true, data: data});
    } else {
        res.json({ success: false, message: "Data not found" });
    }
};


export const read =  async(req,res) =>
{
    const id= req.params.id;
    //const data = await sensorModel.findById(id);
    const data = await Data.find().sort({_id: -1});
    
    if (data) {
        res.json({ success: true, data: data});
    } else {
        res.json({ success: false, message: "Data not found" });
    }
};


export const readSensorGraph =  async(req, res) =>
{
    const sensorId = req.params.sensorId;
    const limit = parseInt(req.query.limit); //data limit
    const data = await Data.find().sort({_id: -1}).limit(limit).select(`sensor${sensorId} Time`);
    if(data)
    {
        res.json({success: true, data: data.reverse()});
    }
    else
    {
        res.json({success: false, message: "data not found"});
    }

};

const projectDataSchema = new mongoose.Schema({
    //projectName: String
});

export const insertProjectData = (req, res) => {
    const projectName = req.query.projectName;
    const parameterValues = Object.keys(req.query).filter(key => key !== 'projectName');



    //creates dynamic schema
    const dynamicSchema = {};
    parameterValues.forEach(param => {
        dynamicSchema[param] = String;
    });


    console.log(dynamicSchema)
    projectDataSchema.add(dynamicSchema);

    const projectDataModel = mongoose.models[projectName] || mongoose.model(projectName, projectDataSchema, projectName);

    //creates dynamic field according to parameterValues
    const projectDataObject = {};
    parameterValues.forEach(param => {
        projectDataObject[param] = req.query[param];
    });

    const projectData = new projectDataModel(projectDataObject);
    projectData.save()
        .then(() => {
            res.status(201).json({ message: "Project data stored" });
        })
        .catch(err => res.status(500).json({ error: err.message }));
}


//BPCL INSERT LINK
export const BPCL = async(req,res)=>{
    const requiredParams = Array.from({ length: 1}, (_, i) => `ac${i + 1}`);

    const missingParams = requiredParams.filter(param => !req.query[param]);
    if (missingParams.length > 0) {
        return res.status(400).json({ error: "Missing required parameters: " + missingParams.join(',') });
    }
    try{
    
        const acValues = [];
        for (const param of requiredParams) {
            acValues.push(req.query[param]);
        }
        const date = new Date();
        const options = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kolkata',
        };
        const formattedTimestamp = date.toLocaleString('en-US', options); 
        const [dd_mm_yy,time] = formattedTimestamp.split(',')
        const[dd,mm,yy]=dd_mm_yy.split('/')
        const fulldate = dd+'-'+mm+'-'+yy+','+time
        acValues.push(fulldate);
       

        await bpclModel.create({ acValues });
        res.status(200).json({ message: "[success]" });
    } catch(err){
        res.status(500).json({ error: err.message });
    }
}



//BPCL READ LINK
export const BPCL_READ = async (req, res) => {
    try {
        const alldata = await bpclModel.find().sort();


        if (alldata.length > 0) {
            // Flatten the array of arrays to a single array
            const acValues = alldata.reduce((acc, curr) => acc.concat(curr.acValues), []);

            res.json({ success: true, data: alldata});
        } else {
            res.json({ success: false, message: "Data not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const BPCL_TOF_INSERT = async (req,res)=>{
    const {tof1,tof2,tof3,tof4,other}=req.query;
    if (!tof1 || !tof2 || !tof3 || !tof4 || !other ) {
        return res.status(400).json({ error: "Missing required parameters" });
    }
    try{

        const date = new Date();
        const options = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kolkata',
        };
        const formattedTimestamp = date.toLocaleString('en-US', options);


        const responseData = ["$000001,200000,000050,000002,180000,280000,000150,000100,000001,000001,000000$"]
        const Tofdata = {
            tof1:tof1,
            tof2:tof2,
            tof3:tof3,
            tof4:tof4,
            other:other,
            time:formattedTimestamp,
        };
        await bpcl_tof_insert.create(Tofdata);
        res.status(200).json(responseData);

    }catch(err){
        res.status(500).json({error:err.message})
    }
}

export const BPCL_ASCAN_CLEAR = async(req,res) =>{
    try {
        await mongoose.connection.db.dropCollection('bpcl_ascans');
        res.status(200).json({ message: 'Collection deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete collection' });
      }
}






export const displayProjectDataLimit = async (req,res) => {
    const {projectName, limit} = req.body;
    const collection = mongoose.connection.db.collection(projectName);
    const projectData = await collection.find({}).sort({_id: -1}).limit(limit).toArray();
    let result = '';
        if (projectData.length > 0) 
        {
            console.log(`Collection ${projectName} found`);
            res.json({ result: `Collection ${projectName} found`,success: true, data: projectData });
        } 
        else 
        {
            console.log(`Collection ${projectName} not found`);
            result = `Collection ${projectName} not found`;
        }
}

//Source apis
export const displayProjectData = async (req, res) => {
    try{
        const {project} = req.query;
        let a = project
        const collection = mongoose.connection.db.collection(a);
        const projectData = await collection.find({}).sort({_id: -1}).limit(100).toArray();
        if(projectData.length >0){
            res.json({success: true, data: projectData });
        }
        else 
        {
            res.json({success: true, data: `Collection ${projectName} not found` });
        }

    }catch(error){
        res.status(500).json({ error: error.message });
    }
}


export const displayProjectReportData = async (req, res) => {
    try{
        const {project,Count} = req.query;
        let a = project
        let b =parseInt(Count)
        const collection = mongoose.connection.db.collection(a);
        const projectData = await collection.find({}).sort({_id: -1}).limit(b).toArray();
        if(projectData.length >0){
            res.json({success: true, data: projectData });
        }
        else 
        {
            res.json({success: true, data: `Collection ${projectName} not found` });
        }
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}


export const DisplayAllData = async (req, res) => {
    try{
        const {project,sensorname,chartlength} = req.query;
        
        let a = project
        let b = parseInt(chartlength);
        const query = {};
        query[sensorname] = { $exists: true };

        const collection = mongoose.connection.db.collection(a);
        const projectData = await collection.find({}).sort({_id: -1}).limit(b).toArray();
        const sensor1Data = projectData.map(doc => doc[sensorname]);
    
        if(sensor1Data.length >0){
            res.json({success: true, data: sensor1Data });
           
        }
        else 
        {
            res.json({success: true, data: `Collection ${projectName} not found` });
        }

    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

export const Creating_project = async (req, res) => {
    try {
      const { data } = req.body;
      const existingProject = await EmployeeModel.findOne({ Project: data.projectName });
  
      if (existingProject) {
        return res.status(409).json({ message: "Project already exists" });
      }

      let password = await bcrypt.hash(data.password, 10);

      const newProject = new EmployeeModel({
        Project: data.projectName,
        Email: data.email,
        Password: password, 
        Parameters: data.parameters,
        ParameterValues: data.parameterValues
      });

      newProject.save()
        .then(() => {
          res.status(201).json({ message: "Project stored" });
        })
        .catch(err => res.status(500).json({ error: err.message }));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  //level mobile application
  export const levelinsert = async (req, res) => {
    const {
        id,
        level,
        devicetemp,
        signal,
        batterylevel,
        humidity,
        pressure,
        altitude,
        datafrequency
    } = req.query;

    const saveAsset = new levelmodel({
        id: String(id),
        level: String(level),
        devicetemp: String(devicetemp),
        signal: String(signal),
        batterylevel: String(batterylevel),
        humidity: String(humidity),
        pressure: String(pressure),
        altitude: String(altitude),
        datafrequency: String(datafrequency)
    });

    try {
        const savedAsset = await saveAsset.save();
        res.status(200).json(savedAsset);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const leveldata = async (req, res) => {
    const { id } = req.params; 
    // console.log("Received ID:", id);  

    try {
        
        const data = await levelmodel.findOne({id: id}).sort({_id: -1}).limit(1);

        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "No data found for the given sensor ID" });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Error fetching data" });
    }
};


export const levelchartdata = async (req, res) => {
        const { sensorId, dataField } = req.params; 
      
        try {
            const results = await levelmodel.find({ id: sensorId }).sort({ createdAt: -1 }).limit(30);
      
            if (results.length === 0) {
                res.status(404).json({ message: `No data found for sensor ID ${sensorId}` });
            } else {
                // Assuming you want to return all entries with the specific field
                const filteredData = results.filter(doc => doc[dataField] != null).map(doc => ({
                // id: doc.id
                    [dataField]: doc[dataField],
                    createdAt: doc.createdAt
                }));
      
                if (filteredData.length > 0) {
                    res.status(200).json(filteredData);
                } else {
                    res.status(404).json({ message: `No data found for sensor ID ${sensorId} with the requested field: ${dataField}` });
                }
            }
        } catch (error) {
            console.error("Error fetching sensor data:", error);
            res.status(500).json({ message: "Internal server error while fetching sensor data" });
        }
      };
      


      export const levelexceldata = async (req, res) => {
        const { id: deviceid, date1, date2 } = req.query;
      
        try {
          const startDate = new Date(date1);
          const endDate = new Date(date2);
      
          const assetDocumentArray = await levelmodel.find({
            id: deviceid,
            $and: [
              { createdAt: { $gte: startDate } },
              { createdAt: { $lte: endDate } },
            ],
          });
          console.log("Device ID:", deviceid);
          console.log("Start Date:", startDate);
          console.log("End Date:", endDate);
      
          console.log("Found asset documents:", assetDocumentArray);
      
          res.json(assetDocumentArray);
        } catch (error) {
          console.error("Error:", error);
          res
            .status(500)
            .json({ error: "Internal Server Error", details: error.message });
        }
      };


      //website pages
      //contact page form
    export const contacts = (req, res) => {
    //nodemailer with outlook
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.WEBSITE_EMAIL,
        pass: process.env.WEBSITE_EMAIL_PASS,
      },
        });
        
    const { name, email, job, company, solution, details } = req.body;

    const mailOptions = {
        from: process.env.WEBSITE_EMAIL,

        to: process.env.ADMIN_EMAIL,
        cc:process.env.CCMail,
        subject: `${name} contacted you through XYMA Website`,
        text: `Name: ${name}\nEmail: ${email}\nJob: ${job}\nCompany: ${company}\nSolution: ${solution}\nDetails: ${details}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        return res.status(500).send(error.toString());
        }
        res.status(200).send("Email sent:" + info.response);
    });
    };

    export const Check =(req,res)=>{
        res.status(200).send("Subscribed Successfully:")
      }


      export const subscription = (req, res) => {
        //nodemailer with outlook
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.WEBSITE_EMAIL,
            pass: process.env.WEBSITE_EMAIL_PASS,
          },
        });

    
      
        const { email } = req.body;
        const mailOptions = {
          from: process.env.WEBSITE_EMAIL,
          to: process.env.ADMIN_EMAIL,
          subject: `Subscription notification from XYMA Website`,
          text: `${email} subscribed to XYMA`,
        };
      
        const subscriptionMainOptions = {
          from: process.env.WEBSITE_EMAIL,
          to: email,
          subject: "Message from XYMA Analytics",
          text: `Hi, Thank you for subscribing to our Website`,
        };
      
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res.status(500).send(error.toString());
          } else {
            res.status(200).send("Subscribed Successfully:" + info.response);
            transporter.sendMail(subscriptionMainOptions, (error, info) => {
              if (error) {
                return res.status(500).send(error.toString());
              } else {
                res
                  .status(200)
                  .send("Subscription sent Successfully:" + info.response);
              }
            });
          }
        });
      };

      //http://localhost:4000/backend/adminsignup?Username=[username]&Password=[password]
export const adminSignup = (req,res) =>
    {
      // username: admin
      // password: admin@xyma.in
      const {Username, Password} = req.query;
      bcrypt.hash(Password, 10)
      .then(hash => {
        AdminInfoModel.create({Username, Password: hash})
        .then(info => res.json(info))
        .catch(err => res.json(err))
      })
      .catch(error => console.log(error.message));
    };


    // admin login
export const adminLogin = (req,res) =>
    {
        console.log("yes")
      const {Username, Password} = req.body;
      AdminInfoModel.findOne({Username: Username})
      .then(user => {
        if(user) {
          bcrypt.compare(Password, user.Password, (err, response) => {
            if(response) {
              const redirectUrl = '/admin@2k24Portal';
              const token = jwt.sign({Username: user.Username}, 'jwt-secret-key', {expiresIn: '1d'});
              res.json({token: token, redirectUrl: redirectUrl});
            }
            else {
              res.json('incorrect password');
            }
          })
        }
        else {
          res.json('invalid user');
        }
      })
      .catch(err => console.log(err));
    };

    //jwt token validation -> protected route -> admin portal
    export const validateToken = (req,res) => {
        const token = req.headers['authorization'];
        if(!token) 
        return  res.json({valid: false}) 
    
        jwt.verify(token, 'jwt-secret-key', (err, user) => {
        if(err) 
            return  res.json({valid: false});
    
        res.json({valid: true});
        });
    };
//add position
export const addPosition = (req,res) => {
    const {DeptName, PositionName, PositionDesc, date} = req.body;
    PositionModel.create({DepartmentName: DeptName, Position: PositionName, PositionDescription: PositionDesc, LastDate: date })
    .then(info => res.json(info))
    .catch(err => res.json(err));
  }

  
  //get position
    export const getPosition = (req,res) => {
        PositionModel.find()
        .then(positions => res.json(positions))
        .catch(err => res.status(500).json(err));
    }
    
    //delete position
    export const deletePosition = (req,res) => {
        const {id} = req.params;
        PositionModel.findByIdAndDelete(id)
        .then(() => {
        res.json({message: 'Position Deleted Successfully'});
        })
        .catch((err) => {
        res.status(500).json({error: err.message});
        });
    };
  

  
  // update position
  export const updatePosition = (req,res) => {
    const {PositionName, PositionDesc, LastDate} = req.body;
    const {id} = req.params;
    PositionModel.findByIdAndUpdate(id, {Position: PositionName, PositionDescription: PositionDesc, LastDate: LastDate}, { new: true })
    .then((updatedPosition) => {
      if(!updatedPosition) {
        return res.status(404).json({error : 'Position not found'});
      }
      res.json({message: 'Position updated successfully', updatedPosition});
    })
    .catch((error) => {
      res.status(500).json({error: error.message});
    });
  };
  
  //add application form in careers to db
  export const uploadApplicationForm = (req,res) => {
  
    const {Name, Email, Phone, LinkedIn, ExpectedSalary, PrevJobCompany, PrevJobTitle, SelfIntro, WhyIntrested, YourExpectations, OurExpectations, Relocate, StartDate, ApplyingForDepartment, ApplyingForPosition} = req.body;
    const { buffer } = req.file
    ApplicationFormModel.create({
      Name,
      Email,
      Phone,
      LinkedIn,
      ExpectedSalary,
      PrevJobCompany,
      PrevJobTitle,
      SelfIntro,
      WhyIntrested,
      YourExpectations,
      OurExpectations,
      Relocate,
      StartDate,
      Resume: {
        data: buffer,
        contentType: "application/pdf",
      },
      ApplyingForDepartment,
      ApplyingForPosition,
    })
      .then((pdf) => {
        res.status(200).send("Application form saved successfully");
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error saving appllication form");
      });
  };
  
  // get application forms
  export const getApplicationForm = (req,res) => {
    ApplicationFormModel.find()
      .then((applicationForms) => res.json(applicationForms))
      .catch((err) => res.status(500).json(err));
  }
  