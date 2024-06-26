import mongoose from 'mongoose';
const Data = new mongoose.Schema({
    sensor1:{
        type:String
    },
    sensor2: {
        type:String
    },
    sensor3:  {
        type:String
    },
    sensor4:  {
        type:String
    },
    sensor5:  {
        type:String
    },
    other: {
        type:String
    },
    timestamp: {
        type:String
    },
})
export default mongoose.model("skf_insertdata", Data);



