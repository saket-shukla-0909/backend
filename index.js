const express = require("express");
const app = express();
const dotenv = require("dotenv").config();


app.use(express.json());

app.listen(process.env.SERVER_PORT, (error)=>{
    if(error){
        console.log(error);
    }else{
        console.log(`Server has started at PORT:${process.env.SERVER_PORT}`);
    }
})