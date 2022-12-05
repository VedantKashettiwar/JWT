const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../config/emailConfig.js");

const userRegistration = async (req, res) => {
  const { name, email, password, password_confirmation, tc } = req.body;
  const user = await UserModel.findOne({ email: email });
  if (user) {
    res.send({ status: "failed", message: "Email already exists" });
  } else {
    if (name && email && password && password_confirmation && tc) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      if (password === password_confirmation) {
        try {
          const newUser = new UserModel({
            name: name,
            email: email,
            password: hashPassword,
            tc: tc,
          });
          await newUser.save();
          const saved_user = await UserModel.findOne({ email: email });
          // Generate JWT
          JWT_SECRET_KEY = "gfhjkhkk1234hfgjfj44";
          const token = jwt.sign({ userID: saved_user._id }, JWT_SECRET_KEY, {
            expiresIn: "60m",
          });
          res.send({
            status: "success",
            message: "Registration Done Successfully",
            token: token,
          });
        } catch (error) {
          res.send({ status: "failed", message: "Unable to register" });
        }
      } else {
        res.send({
          status: "failed",
          message: "Password and Confirm Password doesn't match",
        });
      }
    } else {
      res.send({ status: "failed", message: "All fields are required" });
    }
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await UserModel.findOne({ email: email });
      if (user != null) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (user.email === email && isMatch) {
          // Generate JWT
          JWT_SECRET_KEY = "gfhjkhkk1234hfgjfj44";
          const token = jwt.sign({ userID: user._id }, JWT_SECRET_KEY, {
            expiresIn: "60m",
          });
          res.send({
            status: "success",
            message: "Login Success",
            token: token,
          });
        } else {
          res.send({
            status: "failed",
            message: "Email or Password is not valid",
          });
        }
      } else {
        res.send({ status: "failed", message: "You are not registered user" });
      }
    } else {
      res.send({ status: "failed", message: "All fields are required" });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: "failed", message: "Unable to login" });
  }
};

const changeUserPassword = async (req, res) => {
  try {
    const { password, password_confirmation } = req.body;
    if (password && password_confirmation) {
      if (password !== password_confirmation) {
        res.send({
          status: "failed",
          message: "New password and confirm new password doesn't match",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(password, salt);
        await UserModel.findByIdAndUpdate(req.user._id, {
          $set: { password: newHashPassword },
        });
        res.send({ status: "success", message: "Password change succesfully" });
      }
    } else {
      res.send({ status: "failed", message: "All fields are required" });
    }
  } catch (error) {
    res.send({ status: "failed", message: "Unable to change password" });
  }
};

const loggedUser = async (req, res) => {
  res.send({ user: req.user });
};

const sendUserPasswordResetEmail = async (req, res) => {
 try{
    const { email } = req.body;
    if (email) {
      const user = await UserModel.findOne({ email: email });
      JWT_SECRET_KEY = "gfhjkhkk1234hfgjfj44";
      if (user) {
        const secret = user._id + JWT_SECRET_KEY;
        const token = jwt.sign({ userID: user._id }, secret, {
          expiresIn: "15m",
        });
        const link = `http://localhost:8000/api/user/reset-password/${user._id}/${token}`;
        console.log(link);
        //Send Email
        let info = await transporter.sendMail({
          from:'vedantk164@gmail.com',
          to: user.email,
          subject:'VedantJWT - Password reset link',
          html:`<a href=${link}>Click Here</a> to reset your password`
        })
  
        res.send({
          status: "success",
          message: "Password reset email sent... Please check your Email", "info":info
        });
      } else {
        res.send({ status: "failed", message: "Email don't exist" });
      }
    } else {
      res.send({ status: "failed", message: "Email field is required" });
    }
 }
 catch(error){
    console.log(error)
    res.send({ status: "failed", message: "Trial Error",error });
 }
};

const userPasswordReset = async (req, res) => {
  const { password, password_confirmation } = req.body;
  const { id, token } = req.params;
  const user = await UserModel.findById(id);
  JWT_SECRET_KEY = "gfhjkhkk1234hfgjfj44";
  const new_secret = user._id + JWT_SECRET_KEY;
  try {
    jwt.verify(token, new_secret);
    if (password && password_confirmation) {
      if (password !== password_confirmation) {
        res.send({
          status: "failed",
          message: "New password and Confirm new password doesn't match",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(password, salt);
        await UserModel.findByIdAndUpdate(user._id, {
          $set: { password: newHashPassword },
        });
        res.send({ status: "success", message: "Password change succesfully" });
      }
    } else {
      res.send({ status: "failed", message: "All fields are required" });
    }
  } catch (error) {
    res.send({ status: "failed", message: "Invalid Token" });
  }
};

module.exports = {
  userRegistration,
  userLogin,
  changeUserPassword,
  loggedUser,
  sendUserPasswordResetEmail,
  userPasswordReset
};
