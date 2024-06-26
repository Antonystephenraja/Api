import Data from '../model/sensorModel.js'
import EmployeeModel from '../model/userModel.js'
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


//Register
export const signup =async (req,res) =>
{
    try{
        const {project,userid,password} = req.body;
        console.log("project name",req.body.Project)
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
    console.log(Project);
    console.log(Email);
    console.log(Password);
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
                            redirectUrl = '/dashmain';
                        }
                        else if(user.Project === 'admin')
                        {
                            redirectUrl = '/dashadmin'
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
        await Data.create(newData); // Use Data instead of sensor
        res.status(200).json({ message: "Data inserted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


//jeffery code

export const readLimitMain =  async(req,res) =>
{
    const id= req.params.id;
    //const data = await sensorModel.findById(id);
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
