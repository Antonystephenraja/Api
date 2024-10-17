import mongoose from "mongoose";

const settings_data = new mongoose.Schema({
    Project:String,
    Pulsewidth:String,
    Amplitude:String,
    Gain:String,
    Mode:String,
    Average:String,
    Threshold:String,
    Nop:String,
    Start:String,
    Stop:String,
})
export default mongoose.model("SETTINGS",settings_data)