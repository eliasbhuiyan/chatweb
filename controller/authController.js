const { emailValidator } = require("../helpers/validators");
const userSchema = require("../models/userSchema");
// Registration Controller
const registration = async (req, res) => {
  const { fullName, email, password, avatar } = req.body;

  if (!fullName) return res.status(400).send("Name is required!");
  if (!email) return res.status(400).send("Email is required!");
  if (!password) return res.status(400).send("Passord is required!");
  if (emailValidator(email)) return res.status(400).send("Email is not valid");
  const existingUser = await userSchema.findOne({ email });
  if (existingUser) return res.status(400).send("Email already exist!");
  // 1234
  const user = new userSchema({
    fullName,
    email,
    password,
    avatar,
    otp: "1234",
  });
  user.save();
  // Send this genarated otp to the user email
  // 5 sec er modde otp expired hoye jabe,
  res.status(201).send("Registration susseccfull!");
};
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
module.exports = { registration, loginController };
