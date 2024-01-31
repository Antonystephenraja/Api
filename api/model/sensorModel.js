import mongoose from 'mongoose';
const Data = new mongoose.Schema({
    vibration:{
        type:String
    },
    acoustics: {
        type:String
    },
    temperature:  {
        type:String
    },
    humidity:  {
        type:String
    },
    rpm:  {
        type:String
    },
    magnetic_flex: {
        type:String
    },
    timestamp: {
        type:String
    },
})
export default mongoose.model("insertdata", Data);



