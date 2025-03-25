const { sendMail } = require("../helpers/mail");
const { verifyEmailTemplate } = require("../helpers/templates");
const { emailValidator } = require("../helpers/validators");
const userSchema = require("../models/userSchema");

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

  if (!email) return res.status(400).send("Email is required!");
  if (emailValidator(email)) return res.status(400).send("Email is not valid");
  if (!password) return res.status(400).send("Passord is required!");
  const existingUser = await userSchema.findOne({ email });
  const passCheck = await existingUser.isPasswordValid(password);
  if (!passCheck) return res.status(400).send("Wrong password");

  res.status(200).send("Login Sussessfull");
};
module.exports = { registration, verifyEmailAddress, loginController };
