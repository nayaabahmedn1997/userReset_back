const express =require('express');
const { registerUser, loginUser, getUserData, forgotPassword, resetPassword } = require('../controllers/userController');
const authMiddleWare = require('../middleware/auth');

const userRouter = express.Router();

//Route to register user
userRouter.post("/register", registerUser);


//Route for user login
userRouter.post("/login", loginUser);


//Router to get user data
userRouter.get("/user-data",authMiddleWare,  getUserData);

//Route to for forgot password
userRouter.post("/forgot-password", forgotPassword);

//Route to reset password
userRouter.post("/reset-password/:token", resetPassword)

module.exports = userRouter;