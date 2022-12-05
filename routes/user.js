const express = require("express")
const router = express.Router();
const {userRegistration, userLogin, changeUserPassword, loggedUser, sendUserPasswordResetEmail, userPasswordReset} = require("../controllers/userController");
const checkUserAuth = require("../middlewares/auth_middleware.js");

//Route level middleware - to protect route
router.use('/changepassword',checkUserAuth)
router.use('/loggeduser',checkUserAuth)

//public routes
router.post('/register',userRegistration)
router.post('/login',userLogin)
router.post('/send-reset-passsword-email',sendUserPasswordResetEmail)
router.post('/reset-password/:id/:token',userPasswordReset)


//private routes
router.post('/changepassword',changeUserPassword)
router.get('/loggeduser',loggedUser)

module.exports = router
