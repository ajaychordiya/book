const express = require("express");
const router = express.Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const TOKEN_SECRET = "gjrfhkjgrlkdvksnkgfufeyhjg";
const Joi = require("joi");

//validation using joi

// const schema = {
//     name : Joi.string().min(2).required(),
//     email : Joi.string().min(6).required().email(),
//     password : Joi.string().min(8).required(),
//     mobile_no : Joi.string().min(10).required()
// }

//register
router.post("/register", async (req, res) => {
  // const validation = Joi.validate(req.body,schema);
  // res.send(validation);

  //check Email is Exist

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already Exists");

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //Saving user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
    mobile_no: req.body.mobile_no,
  });

  try {
    const saveuser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

//login
router.post("/login", async (req, res) => {
  //check notEmail is Exist

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email doesnot Exists");

  //password is correct

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword)
    return res
      .status(400)
      .send({ success: false, message: "Invalid password" });

  //create token
  const token = jwt.sign({ _id: user._id }, TOKEN_SECRET);
  res.status(200).send({
    success: true,
    message: "Login successfull",
    user: user._id,
    email: user.email,
    token: token,
  });
  //res.status(200).json({ "token": user.generateJwt() });
  //res.send("sucesss");
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id, (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});
module.exports = router;
