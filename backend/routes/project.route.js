import { Router } from "express";
import { body } from "express-validator";
import * as projectController from "../controllers/project.controller.js";
import * as authMiddleware from "../middleware/auth.middleware.js";
import { validationResult } from "express-validator";

const router = Router();

router.post("/create", 
    authMiddleware.authUser,
    body("name").notEmpty().withMessage("Project name is required"),
    projectController.createProject
);

router.get("/all", authMiddleware.authUser, projectController.getAllProjects);


router.put("/add-user", 
    authMiddleware.authUser,
    body("projectId").isString().withMessage("Project ID must be a string"),
    body("users").isArray().withMessage("Users must be an array"),
    body("users.*").isString().withMessage("Each user must be a string"),
    projectController.addUserToProject
);


router.get("/:projectId", authMiddleware.authUser, projectController.getProjectById);

export default router;