const express = require("express")
const router = express.Router();
const {userRegistration} = require("../controllers/userController")

//public routes
router.post('/register',userRegistration)

//private routes

module.exports = router
