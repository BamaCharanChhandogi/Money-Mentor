import Users from "../models/userModel.js";
import { CompareString, createJWT, generateOTP, hashString, sendOTPEmail } from "../utils/index.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }
    const userExists = await Users.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const otp=generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; 
    sendOTPEmail(email,otp);
    const hashPassword = await hashString(password);
    const user = new Users({ name, email, password: hashPassword,otp,otpExpires });
    // Different way to create user
    // const user = await Users.create({name:name+"charan",email,password});

    const token=await createJWT(user?.id);
    await user.save();
    
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    const passwordMatch = await CompareString(password,user?.password);
    if (!passwordMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    if(user?.isVerified===false){
        return res.status(400).json({ msg: "User not verified" });
    }
    const token=await createJWT(user?.id);

    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user,
        token,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
export const verifyOTP = async (req, res) => {
    try {
      const { email, otp } = req.body;
      
      if (!email || !otp) {
        return res.status(400).json({ msg: "Please provide email and OTP" });
      }
  
      const user = await Users.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "User not found" });
      }
  
      if (user.otp !== otp || user.otpExpires < Date.now()) {
        return res.status(400).json({ msg: "Invalid or expired OTP" });
      }
  
      // OTP is valid, clear OTP fields
      user.otp = undefined;
      user.otpExpires = undefined;
    user.isVerified = true;
      await user.save();
  
      const token = await createJWT(user?.id);
      
      res.status(200).json({
        success: true,
        message: "OTP verified successfully. User logged in.",
        token,
        user,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  };
  