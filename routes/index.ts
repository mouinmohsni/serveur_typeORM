import * as express from "express";
 // import * as userRouter from "./userRoutes"
 const userRoutes = require('./routes/userRoutes');
const { authenticate }=require("../middlewares/checkJwt")


export =()=>{
    let router =express.Router();
    router.use('/users',authenticate)
}