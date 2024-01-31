import Data from '../model/sensorModel.js'
import User from "../model/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

//Register
export const userRegister = async (req, res) => {
    console.log(req.body)
    try {
        const newPassword = await bcrypt.hash(req.body.password, 10)
        await User.create({
            email: req.body.email,
            password: newPassword,
        })
        res.json({status: 'ok'})
    } catch (error) {
        res.json({status: 'error', error: 'Duplicate email'})
    }
}

//login
export const userData = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
    })
    if(!user) {
        return {status: 'error', error: 'Invalid User'}
    }
    const isPasswordVaild = await bcrypt.compare(
        req.body.password,
        user.password
    )
    if (isPasswordVaild) {
        const token = jwt.sign(
            {
                name: user.name,
                email: user.email
            },
            'secret123'
        )
        return res.json({status: 'ok', user: token})
    } else {
        return res.json({status: 'error', user: false})
    }
}

//Insert 
export const InsertData = async (req, res) => {
    const { vibration, acoustics, temperature, humidity, rpm, magnetic_flex, timestamp } = req.query;

    if (!vibration || !acoustics || !temperature || !humidity || !rpm || !magnetic_flex || !timestamp) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    try {
        const newData = {
            vibration: vibration,
            acoustics: acoustics,
            temperature: temperature,
            humidity: humidity,
            rpm: rpm,
            magnetic_flex: magnetic_flex,
            timestamp: timestamp,
        };

        await Data.create(newData); // Use Data instead of sensor
        res.status(200).json({ message: "Data inserted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};