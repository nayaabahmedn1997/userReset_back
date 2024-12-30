const express =require('express');
const { registerUser, loginUser } = require('../controllers/userController');

const userRouter = express.Router();

//Route to register user
userRouter.post("/register", registerUser);


//Route for user login
userRouter.post("/login", loginUser);


module.exports = userRouter;