import mongoose from "mongoose";
const project_data =new mongoose.Schema({
    project: [String]
})
export default mongoose.model("PROJECT_LIST",project_data)