import mongoose from "mongoose";

const xymaClientsSchema = new mongoose.Schema({
  ClientName: String,
  ClientUrl: String,
});

const xymaClientsModel = mongoose.model("xymaClient", xymaClientsSchema);
export default xymaClientsModel;
