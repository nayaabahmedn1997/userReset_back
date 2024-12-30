const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports =async (req, res, next)=>{


    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ message: "Token missing" });
    const token = authHeader.split(" ")[1];
    if(!token)
    {
        return res.status(401).json({
            message:"Access denied required the token"
        })
    }
    
  try {
    const user = await jwt.verify(token, process.env.SECRECT_KEY);
    // Add the verified user info to the request object
    req.user = user
    next();
  } catch(error) {
    console.log(error)
    res.status(403).json({ message: "Invalid or expired token" });
  }
}

