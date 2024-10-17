import mongoose from "mongoose";

const bpclSchema = new mongoose.Schema({
    ac1: String,
    ac2: String
});

export default mongoose.model("BPCL_ASCAN", bpclSchema);
