import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const hashString = async (userValue)=>{
    const salt= await bcrypt.genSalt(10);
    const hashPassword=bcrypt.hash(userValue,salt);
    return hashPassword;
}
export const CompareString = async (userPassword,password)=>{
    try{
        const isMatch=await bcrypt.compare(userPassword, password);
        return isMatch;
    }
    catch(err){
        console.log(err);
    }
}

export const createJWT=async(id)=>{
    return jwt.sign({userId:id},process.env.JWT_SECRET,{expiresIn:'1d'});
}


// Generate a 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
// Re-export mailer functions from mailerService
export {
  sendEmail,
  sendOTPEmail,
  sendInvitationEmail,
} from '../services/mailerService.js';