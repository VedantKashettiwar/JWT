const jwt = require("jsonwebtoken")
const UserModel = require("../models/User.js")

const checkUserAuth = async(req,res,next)=>{
    let token
    const {authorization} = req.headers
    if(authorization && authorization.startsWith('Bearer')){
        try{
            // get token from header
            token = authorization.split(' ')[1]
            // console.log("Token", token)
            // console.log("Authorization", authorization)


            // Verify Token
            JWT_SECRET_KEY = "gfhjkhkk1234hfgjfj44";
            const {userID} = jwt.verify(token,JWT_SECRET_KEY)
            //Get user from token
            req.user = await UserModel.findById(userID).select("-password")
            next()
        }
        catch(error){
            res.status(401).send({"status":"failed","message":"Unauthorized User"})
        }
    }
    if(!token){
        res.status(401).send({"status":"failed","message":"Unauthorized User, No token"})
    }
}


module.exports = checkUserAuth