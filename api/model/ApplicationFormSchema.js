import mongoose from 'mongoose';

const ApplicationFormSchema = new mongoose.Schema({
  Name: String,
  Email: String,
  Phone: String,
  LinkedIn: String,
  ExpectedSalary: String,
  PrevJobCompany: String,
  PrevJobTitle: String,
  SelfIntro: String,
  WhyIntrested: String,
  YourExpectations: String,
  OurExpectations: String,
  Relocate: String,
  StartDate: String,
  Resume: {
    data: Buffer,
    contentType: String,
  },
  ApplyingForDepartment: String,
  ApplyingForPosition: String,
});

const ApplicationFormModel = mongoose.model('ApplicationForm',ApplicationFormSchema);
export default ApplicationFormModel;