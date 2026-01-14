import express from "express";
import Application from "../models/application.js";

const router = express.Router();

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: Create a new application
 *     description: Creates a new job application with the provided details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               company:
 *                 type: string
 *               duration:
 *                 type: string
 *               description:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application created successfully
 *       400:
 *         description: Bad request - validation error
 *       500:
 *         description: Server error
 */
router.post("/", async (req, res) => {
  try {
    // Get application data from request body
    const { title, company, duration, description, userId } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!company) {
      return res.status(400).json({ message: "Company is required" });
    }
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Create a new application instance
    const newApplication = new Application({
      title,
      company,
      duration,
      description,
      userId,
    });

    // Save the new application to the database
    const savedApplication = await newApplication.save();

    // Return success response
    res.status(201).json(savedApplication);
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: Get all applications
 *     description: Retrieves a list of all job applications
 *     responses:
 *       200:
 *         description: Successfully retrieved all applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
  try {
    // Fetch all applications from the database and populate user details
    const applications = await Application.find().populate("userId");
    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /applications/{id}:
 *   get:
 *     summary: Get an application by ID
 *     description: Retrieves a specific job application by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The application ID
 *     responses:
 *       200:
 *         description: Successfully retrieved the application
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */
router.get("/:id", async (req, res) => {
  try {
    // Get application ID from req.params.id
    const applicationId = req.params.id;

    // Fetch the specific application from the database
    const application = await Application.findById(applicationId).populate(
      "userId"
    );

    // If application not found, return 404
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Return the application
    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /applications/{id}:
 *   put:
 *     summary: Update an application
 *     description: Updates an existing job application by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               company:
 *                 type: string
 *               duration:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Application updated successfully
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */
router.put("/:id", async (req, res) => {
  try {
    // Get application ID from req.params.id
    const applicationId = req.params.id;

    // Get updated data from req.body
    const updatedData = req.body;

    // Update the application in the database
    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      updatedData,
      { new: true, runValidators: true } // return updated doc and run schema validators
    );

    // If application not found, return 404
    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Return the updated application
    res.json(updatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /applications/{id}:
 *   delete:
 *     summary: Delete an application
 *     description: Deletes a job application by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The application ID
 *     responses:
 *       200:
 *         description: Application deleted successfully
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", async (req, res) => {
  try {
    // Get application ID from request parameters
    const applicationId = req.params.id;

    // Remove the application from the database
    const deletedApplication = await Application.findByIdAndDelete(
      applicationId
    );

    // If application not found, return 404
    if (!deletedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Return success message
    res.json({
      message: "Application deleted successfully",
      application: deletedApplication,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;