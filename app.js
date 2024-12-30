const express = require('express');
const userRouter = require('./routes/userRoute');
const cors = require('cors');



const app = express();
//Middlewares
app.use(express.json());
app.use(
    cors({
      origin: "*", // Replace with your frontend URL
      methods: "GET,POST,PUT,DELETE",
      credentials: true, // Enable cookies
    })
  );
app.use("/api/users/", userRouter);
// Allow specific origins


module.exports = app;