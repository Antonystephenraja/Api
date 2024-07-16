import mongoose from "mongoose";

const PositionSchema = new mongoose.Schema({
  DepartmentName: String,
  Position: String,
  PositionDescription: String,
  LastDate: String
});

const PositionModel = mongoose.model("Position", PositionSchema);
export default PositionModel;
