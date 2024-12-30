const http =require('http');
const dotenv = require('dotenv');
const app = require('./app');
const connectDB = require('./db/db');
dotenv.config();


const server = http.createServer(app);
const PORT  = 6000;

//Connect to Database
connectDB();


server.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})


