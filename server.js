const http =require('http');
const dotenv = require('dotenv');
dotenv.config();


const server = http.createServer();
const PORT  = 6000;


server.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})


