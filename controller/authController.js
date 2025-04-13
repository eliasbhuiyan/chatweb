const cloudinary = require("../helpers/cloudinary");
const generateRandomString = require("../helpers/generateRandomString");
const { sendMail } = require("../helpers/mail");
const { verifyEmailTemplate, resetPassTemplate } = require("../helpers/templates");
const { emailValidator } = require("../helpers/validators");
const userSchema = require("../models/userSchema");
const jwt = require('jsonwebtoken');
const fs = require('fs');
// Registration Controller
const registration = async (req, res) => {
  const { fullName, email, password, avatar } = req.body;

  try {
    if (!fullName) return res.status(400).send("Name is required!");
      if (!email) return res.status(400).send("Email is required!");
      if (!password) return res.status(400).send("Passord is required!");
      if (emailValidator(email)) return res.status(400).send("Email is not valid");
      const existingUser = await userSchema.findOne({ email });
      if (existingUser) return res.status(400).send("Email already exist!");
    
      // Generate random 4 digit OTP number
      const randomOtp = Math.floor(Math.random() * 9000);

      const user = new userSchema({
        fullName,
        email,
        password,
        avatar,
        otp: randomOtp,
        otpExpiredAt: new Date(Date.now() + 5 * 60 * 1000)
      });
      user.save();

      // Send this genarated otp to the user email
      sendMail(email, "Verify your email.", verifyEmailTemplate, randomOtp)

      res.status(201).send("Registration susseccfull! Please verify your email.");
  } catch (error) {
    res.status(500).send("Server error!")
  }
};

const verifyEmailAddress = async (req, res)=>{
  const {email, otp} = req.body;

  try {
    if(!email || !otp) return res.status(400).send("Invalid reqest!")
      const verifiedUser = await userSchema.findOne({email, otp, otpExpiredAt: {$gt: Date.now()}})  
      if(!verifiedUser) return res.status(400).send("Invalid OTP!")
     
      verifiedUser.otp = null;
      verifiedUser.otpExpiredAt = null;
      verifiedUser.isVarified = true;  
      verifiedUser.save()
      res.status(200).send("Email verified successfully!")
  } catch (error) {
    res.status(500).send("Server error!")
  }
}

// Login Controller
const loginController = async (req, res) => {
  const { email, password } = req.body;

 try {
  if (!email) return res.status(400).send("Email is required!");
  if (emailValidator(email)) return res.status(400).send("Email is not valid");
  if (!password) return res.status(400).send("Passord is required!");
  const existingUser = await userSchema.findOne({ email });
  if(!existingUser) return res.status(400).send("User not found!")
  const passCheck = await existingUser.isPasswordValid(password);
  if (!passCheck) return res.status(400).send("Wrong password");
  if(!existingUser.isVarified) return res.status(400).send("Email is not verified!");

  const accessToken = jwt.sign({
    data: {
      email: existingUser.email,
      id: existingUser._id
    }
  }, process.env.JWT_SEC, { expiresIn: '24h' });
  
  const loggedUser = {
    email: existingUser.email,
    _id: existingUser._id,
    fullName: existingUser.fullName,
    avatar: existingUser.avatar,
    isVarified: existingUser.isVarified,
    createdAt: existingUser.createdAt,
    updatedAt: existingUser.updatedAt
  }

  res.status(200).send({message: "Login Sussessfull", user: loggedUser, accessToken});
 } catch (error) {
  res.status(500).send("Server error!")
 }
};

// Forgat password
const forgatPass = async (req, res) => {
  const {email} = req.body;

 try {
  if (!email) return res.status(400).send("Email is required!");
  const existingUser = await userSchema.findOne({ email });
  if(!existingUser) return res.status(400).send("User not found!")
  
  const randomString = generateRandomString(28);
  existingUser.resetPassId = randomString;
  existingUser.resetPassExpiredAt = new Date(Date.now() + 10 * 60 * 1000)
  existingUser.save()

  // Send reset password email
  sendMail(email, "Reset Password.", resetPassTemplate, randomString)
  res.status(201).send("Check your email")
 } catch (error) {
  res.status(500).send("Server error!")
 }
}

// Reset password
const resetPass = async (req, res)=>{
 const {newPass} =  req.body;
 const randomString = req.params.randomstring;
 const email = req.query.email;
 
 const existingUser = await userSchema.findOne({email, resetPassId: randomString, resetPassExpiredAt: {$gt: Date.now()}})  
 if(!existingUser) return res.status(400).send("Invalid Request!")
 if(!newPass) return res.status(400).send("Input your new password")
  existingUser.password = newPass;
  existingUser.resetPassId = null;
  existingUser.resetPassExpiredAt = null;
  existingUser.save()

  res.status(200).send("Reset password successfully!")
}

const update = async (req, res)=>{
  const {fullName, password, avatar} = req.body;
  const updatedFields = {}
  if(fullName) updatedFields.fullName = fullName.trim();
  if(password) updatedFields.password = password;
  if(avatar) updatedFields.avatar = avatar;

  cloudinary.uploader.upload(req.file.path, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Error uploading to Cloudinary' });
    }
    console.log(result);
    console.log(req.file.path);
    
    fs.unlinkSync(req.file.path)
  })

  const existingUser = await userSchema.findByIdAndUpdate("67f4f9f083c5409a6898f62f" , updatedFields, {new: true})
   
  res.send(existingUser)
}
module.exports = { registration, verifyEmailAddress, loginController, forgatPass, resetPass, update};