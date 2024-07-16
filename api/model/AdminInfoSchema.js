import mongoose from "mongoose";

const AdminInfoSchema = new mongoose.Schema({
    Username: String,
    Password: String
});

const AdminInfoModel = mongoose.model('AdminInfo',AdminInfoSchema);
export default AdminInfoModel;