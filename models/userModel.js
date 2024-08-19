import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: String,
  otpExpires: Date,
  isVerified: { type: Boolean, default: false },
},);

const Users = mongoose.model('User',userSchema);
export default Users;
