import mongoose from "mongoose";

const xymaClientsSchema = new mongoose.Schema({
  ClientName: String,
  ClientUrl: String,
  ClientLogo: Buffer,
  LogoContentType: String,
});

const xymaClientsModel = mongoose.model("xymaClient", xymaClientsSchema);
export default xymaClientsModel;
