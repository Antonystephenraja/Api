import mongoose from  'mongoose';

const EmployeeSchema = new mongoose.Schema(
    {
        Project: String,
        Email: String,
        Password: String,
    }
)

const EmployeeModel = mongoose.model('employees_Login', EmployeeSchema)
export default EmployeeModel;