import mongoose from "mongoose";
const { Schema } = mongoose;

const assetSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    level: {
        type: String,
    },
    devicetemp: {
        type: String,
    },
    signal: {
        type: String,
    },
    batterylevel: {
        type: String,
    },
    humidity: {
        type: String,
    },
    pressure: {
        type: String,
    },
    altitude: {
        type: String,
    },
    datafrequency: {
        type: String,
    },

},{timestamps: true}); 

assetSchema.pre("save", function (next) {
    const currentDate = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; 
    const istDate = new Date(currentDate.getTime() + istOffset);
  
    
    this.createdAt = istDate.toISOString().replace('T', ' ').split('.')[0];
    this.updatedAt = istDate.toISOString().replace('T', ' ').split('.')[0];
  
    next();
});

assetSchema.virtual('createdAtFormatted').get(function() {
    return this.createdAt.toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour12: false });
});

assetSchema.virtual('updatedAtFormatted').get(function() {
    return this.updatedAt.toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour12: false });
});


export default mongoose.model('Mobile_Leveldata', assetSchema)