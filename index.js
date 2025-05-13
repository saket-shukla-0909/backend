const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const connectDB = require("./config/db")



connectDB();
app.use(express.json());
app.use("/auth", require("./routes/userRoutes"));

app.listen(process.env.SERVER_PORT, (error)=>{
    if(error){
        console.log(error);
    }else{
        console.log(`Server has started at PORT:${process.env.SERVER_PORT}`);
    }
})