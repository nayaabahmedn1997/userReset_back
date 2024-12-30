const mongoose =require('mongoose');
const bcrypt = require('bcrypt');
const dotenv =require('dotenv');
dotenv.config();



const userSchema = mongoose.Schema({
    name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },

});

userSchema.pre('save', async function (next){
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, process.env.SALT| 7)
    next();
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;