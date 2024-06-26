import mongoose from "mongoose";

const bpclSchema = new mongoose.Schema({
    acValues: [String]
});

export default mongoose.model("BPCL_ASCAN", bpclSchema);
