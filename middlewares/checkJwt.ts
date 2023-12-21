const jwt = require('jsonwebtoken')
import config from "../config/config";
 import { Request, Response, NextFunction } from "express";


module.exports.authenticate = (req:Request, res:Response, next:NextFunction) => {
    const token = <string>req.headers["usertoken"];
    let jwtPayload;
    try {
        jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        console.log("jwtPayload",jwtPayload)
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        //If token is not valid, respond with 401 (unauthorized)
        res.status(401).send("not auth");
        return;
    }

    //The token is valid for 1 hour
    //We want to send a new token on every request
    const { userId, username } = jwtPayload;
    const newToken = jwt.sign({ userId, username }, config.jwtSecret, {
        expiresIn: "1h"
    });
    res.setHeader("token", newToken);

    //Call the next middleware or controller
    next();

}