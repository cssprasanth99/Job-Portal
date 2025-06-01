import express from "express";
import { getJobById, getJobs } from "../controllers/jobController.js";

const router = express.Router();

// Route to get all jobs data
router.get("/get-jobs", getJobs);

// Route to get single job data by ID
router.get("/:id", getJobById);

export default router;
