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
// Send OTP via email (using nodemailer)
export const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    };
  
    await transporter.sendMail(mailOptions);
  };

// Send invitation email to join a family
export const sendInvitationEmail = async (email, familyName) => {
  try {
    // Create a transporter using environment variables
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Email template
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `Invitation to Join ${familyName} on Finance Manager`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Family Finance Invitation</h2>
          <p>Hello,</p>
          <p>You've been invited to join <strong>${familyName}</strong> on Finance Manager!</p>
          <p>As a family member, you'll be able to:</p>
          <ul>
            <li>View and manage shared expenses</li>
            <li>Participate in family budgeting</li>
            <li>Track shared financial goals</li>
            <li>Collaborate on financial decisions</li>
          </ul>
          <p>To accept this invitation, please log in to your account and visit the Family section.</p>
          <div style="margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/login" 
               style="background-color: #3498db; 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 4px;">
              Log In Now
            </a>
          </div>
          <p style="color: #7f8c8d; font-size: 0.9em;">
            If you don't have an account yet, you can create one using this email address.
          </p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #7f8c8d; font-size: 0.8em;">
            This is an automated message, please do not reply to this email.
          </p>
        </div>
      `
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending invitation email:', error);
    throw new Error('Failed to send invitation email');
  }
};