const UserModel = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userRegistration = async(req,res)=>{
    const {name, email, password, password_confirmation, tc} = req.body
    const user = await UserModel.findOne({email:email})
    if(user){
        res.send({"status":"failed", "message":"Email already exists"})
    }
    else{
        if(name && email && password && password_confirmation && tc){
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)
            if(password === password_confirmation){
                try{
                    const newUser = new UserModel({
                        name:name,
                        email:email,
                        password:hashPassword,
                        tc:tc
                    })
                    await newUser.save()
                    res.send({"status":"success", "message":"Registration Done Successfully"})
                }
                catch(error){
                    res.send({"status":"failed", "message":"Unable to register"})
                }
            }
            else{
                res.send({"status":"failed", "message":"Password and Confirm Password doesn't match"})
            }
        }
        else{
            res.send({"status":"failed", "message":"All fields are required"})
        }
    }
}

const userLogin= async(req,res)=>{
    try{
        const {email, password}= req.body
        if(email && password){
            
        }
        else{
            res.send({"status":"failed", "message":"All fields are required"})
        }
    }
    catch(error){
        console.log(error)
    }
}

module.exports = {userRegistration}
