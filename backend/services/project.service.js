import Project from "../models/project.model.js";
import mongoose from "mongoose";

export const createProject = async ({name, userId}) => {
    if(!name || !userId) {
        throw new Error("Name and userId are required");
    }

    const project = await Project.create({
        name, 
        users: [userId]
    });
    return project;
}


export const getAllProjects = async ({userId}) => {
    if(!userId) {
        throw new Error("userId is required");
    }

    const projects = await Project.find({users: userId});
    return projects;
}


export const addUserToProject = async ({projectId, users, userId}) => {
    if(!users || !projectId || !userId) {
        throw new Error("Users, userId and projectId are required");
    }

    // Check if projectId is valid MongoDB ObjectId
    if(!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid project ID format");
    }
    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID format");
    }

    // Check if all user IDs in array are valid MongoDB ObjectIds
    const invalidUserIds = users.filter(userId => !mongoose.Types.ObjectId.isValid(userId));
    if(invalidUserIds.length > 0) {
        throw new Error("Invalid user ID format in users array");
    }

    // First check if the project exists and if the current user has access
    const project = await Project.findOne({ _id: projectId, users: userId });
    if(!project) {
        throw new Error("Project not found or you don't have access to it");
    }

    // Add new users to the project
    const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        { $addToSet: { users: { $each: users } } },
        { new: true }
    );

    return updatedProject;
}


export const getProjectById = async ({projectId}) => {
    if(!projectId) {
        throw new Error("projectId and are required");
    }

    if(!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid project ID format");
    }

    const project = await Project.findOne({_id: projectId}).populate("users");
    return project;
}