const userModel = require("../models/userModel");
const jwt =require('jsonwebtoken');
const bcrypt = require('bcrypt');


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

module.exports = {registerUser, loginUser};