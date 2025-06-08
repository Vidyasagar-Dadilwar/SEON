import userModel from "../models/user.model.js";
import * as userService from "../services/user.service.js";
import { validationResult } from "express-validator";
import redisClient from "../services/redis.service.js";

export const createUserController = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try {
        const {email, password} = req.body;
        const user = await userService.createUser({email, password});
        const token = user.generateJWT();
        delete user._doc.password;
        res.status(201).json({user, token});
    } 
    catch (error) {
        res.status(500).json({error: error.message});
    }
}


export const loginUserController = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try {
        const {email, password} = req.body;
        const user = await userService.loginUser({email, password});
        const token = user.generateJWT();
        delete user._doc.password;
        res.status(200).json({user, token});
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
}


export const profileController = async (req, res) => {
    res.status(200).json({user: req.user});
}


export const logoutController = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];
        await redisClient.set(token, "logout", {EX: 60 * 60 * 24});
        res.clearCookie("token");
        res.status(200).json(
            {
                message: "Logged out successfully"
            }
        );
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}