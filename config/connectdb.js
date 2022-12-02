const mongoose = require("mongoose");
const connectDb = async()=>{
    try{
        await mongoose.connect("mongodb+srv://VedantKashettiwar:Wohlig%40123@cluster0.0l1d7r7.mongodb.net/VedantJWT?authSource=admin&replicaSet=atlas-uy925y-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true")
        console.log('Connected to database')
    }
    catch(err){console.log(err)}
}

module.exports =(connectDb)