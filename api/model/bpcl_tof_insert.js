import mongoose from "mongoose";
const tofInsert = new mongoose.Schema({
    tof1:{
        type:String
    },
    tof2:{
        type:String
    },
    tof3:{
        type:String
    },
    tof4:{
        type:String
    },
    other:{
        type:String
    },
    time:{
        type:String
    }
})

export default mongoose.model("bpcl_tof_insert", tofInsert);