const express = require("express");
const router = express.Router();

const Job = require("../models/Job");

// GET all jobs
router.get("/", async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });

        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch jobs",
            error: error.message,
        });
    }
});

// GET one job
router.get("/:id", async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch job",
            error: error.message,
        });
    }
});

// CREATE job
router.post("/", async (req, res) => {
    try {
        const newJob = new Job(req.body);

        const savedJob = await newJob.save();

        res.status(201).json(savedJob);
    } catch (error) {
        res.status(400).json({
            message: "Failed to create job",
            error: error.message,
        });
    }
});

// UPDATE job
router.put("/:id", async (req, res) => {
    try {
        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedJob) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        res.status(200).json(updatedJob);
    } catch (error) {
        res.status(400).json({
            message: "Failed to update job",
            error: error.message,
        });
    }
});

// DELETE job
router.delete("/:id", async (req, res) => {
    try {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);

        if (!deletedJob) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        res.status(200).json({
            message: "Job deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete job",
            error: error.message,
        });
    }
});

// IMPORTANT
module.exports = router;