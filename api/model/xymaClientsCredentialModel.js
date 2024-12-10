import mongoose from "mongoose";

const credentialsSchema = new mongoose.Schema({
  ClientName: String,
  ProjectName: String,
  Email: String,
  Password: String,
  Iv: String,
});

const credentialsModel = mongoose.model(
  "XymaClientsCredential",
  credentialsSchema
);
export default credentialsModel;
