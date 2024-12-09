import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema({
  Username: String,
  Password: String,
});

const passwordModel = mongoose.model("XymaClietsPassword", passwordSchema);
export default passwordModel;
