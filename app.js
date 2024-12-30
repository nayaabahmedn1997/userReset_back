const express = require('express');
const userRouter = require('./routes/userRoute');


const app = express();
//Middlewares
app.use(express.json());
app.use("/api/users/", userRouter);

module.exports = app;