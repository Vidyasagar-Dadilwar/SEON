import userModel from "../models/user.model.js";
import projectModel from "../models/project.model.js";
import * as projectService from "../services/project.service.js";
import { validationResult } from "express-validator";


export const createProject = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
    const {name} = req.body;
    const loggedInUser = await userModel.findOne({email: req.user.email});
    const userId = loggedInUser._id;

    
        const project = await projectService.createProject({name, userId});
        res.status(201).json(project);
    } 
    catch (error) {
        res.status(500).json({message: error.message});
    }
}


export const getAllProjects = async (req, res) => {
    try {
        const loggedInUser = await userModel.findOne({email: req.user.email});
        
        const userId = loggedInUser._id;

        const projects = await projectService.getAllProjects({userId});

        return res.status(200).json(projects);
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
}


export const addUserToProject = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const { projectId, users } = req.body;
        const loggedInUser = await userModel.findOne({email: req.user.email});
        const userId = loggedInUser._id;

        const project = await projectService.addUserToProject({projectId, users, userId});
        return res.status(200).json(project);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
}


export const getProjectById = async (req, res) => {
    try {
        const {projectId} = req.params;

        const project = await projectService.getProjectById({projectId});
        
        return res.status(200).json(project);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
}