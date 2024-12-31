const userModel = require("../models/userModel");
const jwt =require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();
const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL, // Replace with your email
      pass: process.env.PASSWORD, // Replace with your email password
    },
  });

const registerUser = async (req, res) =>{

    try {
        const {name, email, password} = req.body;
        const existingUser = await userModel.findOne({email});
        if(existingUser)
        {
            return res.status(400).json({
                "message":"User already exists"
            })
        };
        const user  = new userModel({name, email, password});
        await user.save();
        return res.status(201).json({
            "message":"User successfully created"
        })
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
}


const loginUser =async (req, res)=>{
    try {
        const {email,password} = req.body;
        const user = await userModel.findOne({email});
        
        //Check is user exists
        if(!user)
        {
            return res.status(404).json({
                "message":"User doesn't exists"
            });
        }
        console.log(user);
        //Check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect)
        {
            return res.status(400).json({
                "message":"Invalid password"
            });
        }

        const token  = jwt.sign({id: user._id}, process.env.SECRECT_KEY, {expiresIn:"1d"});
        return res.status(200).json({
            message:"Login successful",
            token,
            userId : user._id
        })

    } catch (error) {
        return res.status(500).json({error:error.message});
    }
}

const getUserData = async (req, res)=>{
    try {
        const {id} = req.user;
        const user = await userModel.findById(id);
        if(!user)
        {
            return res.status(404).json({
                "message":"User not found"
            })
        }
        return res.status(200).json({
            "message":"User data successfully fetched",
            user
        })
        
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

const forgotPassword = async(req, res)=>{
    const { email } = req.body;
    const user = await userModel.findOne({email});
    if(!user)
    {
        return res.status(404).json({
            "message":"user not found"
        })
    }
    

    //Generate a reset token
    const resetToken  = jwt.sign({email}, process.env.RESET_SECRET_KEY, {expiresIn:"1hr"});
    user.resetToken = resetToken;
    await user.save();

  // Send reset link via email
  const resetLink = `https://resetgucipassword.netlify.app/reset-password/${resetToken}`;
   transporter.sendMail({
    from: "nayaabahmedn@gmail.com",
    to: email,
    subject: "Password Reset",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });

  res.status(200).json({ message: "Reset link sent to your email", resetToken });


}

const resetPassword = async (req, res)=>{
    try {
        const {token} = req.params;
        const {password} = req.body;

        const decoded = jwt.verify(token, process.env.RESET_SECRET_KEY);
        const user = await userModel.findOne({email: decoded.email});
        
        //update the password
        user.password = password;
        await user.save();
        return res.status(200).json({
            "message":"Password rest successful"
        })

    } catch (error) {
        res.status(400).json({"message":"Invalid token"});
    }
}
module.exports = {registerUser, loginUser, getUserData, forgotPassword, resetPassword};