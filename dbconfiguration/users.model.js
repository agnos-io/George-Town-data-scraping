const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  Title: { type: String},
  First_Name: { type: String },
  Middle_Name: { type: String},
  Last_Name:{ type: String},
  Email:{type:String},
  Other_Email: { type: String },
  Street: { type: String },
  Address:{type:String},
  City: { type: String},
  State: { type: String },
  stateCode: { type: String},
  Country:{ type: String },
  Postal_Code:{type:String},
  Mobile_Phone_Number: { type: String },
  Phone_Number: { type: String},
  WebsiteAddress1: { type: String},
  Professional:{ type: String },
  Summary:{type:String},
  Skills: { type: String},
  Past: { type: String },
  Experience_Position_1: { type: String },
  Past_Experience_Company_1:{ type: String},
  Past_Experience_Position_2:{type:String},
  Past_Experience_Company_2: { type: String },
  School: { type: String},
  Graduation_Date: { type: String},
  Major_Degree:{ type: String},
  Other_Education_1:{type:String},
  Graduation_for_Other_Education_1: { type: String},
  Other_Education_2: { type: String },
  Job_Title: { type: String},
  Company_name:{ type: String },
  work_Email:{type:String},
  Work_Phone: { type: String },
  ALL_Data: { type: String, required:true},
  profileURL: { type: String},
  index:{ type: Number },
  occupationCode:{type:String,required:true},
  isValidEmail: { type: Boolean },
  industryCategory: { type: String },
  domainURL: { type: String},
  socialLinks:{ type: String}
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);
