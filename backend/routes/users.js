import express from "express";
import multer from "multer";
import { MongoClient, GridFSBucket } from "mongodb";
import User from "../models/users.js";
import mongoose from "mongoose";

const router = express.Router();

// Configure multer for file uploads (store in memory temporarily)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX allowed'));
    }
  }
});

// Helper function to get GridFS bucket
const getGridFSBucket = () => {
  return new GridFSBucket(mongoose.connection.db);
};

// Helper function to delete old resume from GridFS
const deleteOldResume = async (fileId) => {
  if (!fileId) return;
  try {
    const bucket = getGridFSBucket();
    await bucket.delete(fileId);
  } catch (error) {
    console.error("Error deleting old resume:", error);
  }
};

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user account with the provided details
 */
router.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required" });
    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!password) return res.status(400).json({ message: "Password is required" });

    const newUser = new User({
      name,
      email,
      password,
      role: role || "user",
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 */
router.get("/", async (req, res) => {
  try {
    const { email, password } = req.query;
    let filter = {};
    if (email) filter.email = email;
    if (password) filter.password = password;

    const users = await User.find(filter);
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user with optional file upload
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               resume:
 *                 type: string
 *                 format: binary
 */
router.put("/:id", upload.single("resume"), async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    // Find the user first
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update basic fields
    const updatedData = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (password) updatedData.password = password;

    // Handle resume file if uploaded
    if (req.file) {
      // Delete old resume if it exists
      if (user.resume?.fileId) {
        await deleteOldResume(user.resume.fileId);
      }

      // Upload new resume to GridFS
      const bucket = getGridFSBucket();
      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
      });

      uploadStream.end(req.file.buffer);

      // Wait for upload to complete
      await new Promise((resolve, reject) => {
        uploadStream.on("finish", () => {
          updatedData.resume = {
            fileId: uploadStream.id,
            filename: req.file.originalname,
            mimetype: req.file.mimetype,
            uploadDate: new Date(),
            size: req.file.size
          };
          resolve();
        });
        uploadStream.on("error", reject);
      });
    }

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatedData,
      { new: true, runValidators: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

/**
 * @swagger
 * /users/{id}/resume:
 *   get:
 *     summary: Download user's resume
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get("/:id/resume", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user || !user.resume?.fileId) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const bucket = getGridFSBucket();
    const downloadStream = bucket.openDownloadStream(user.resume.fileId);

    res.set("Content-Type", user.resume.mimetype);
    res.set("Content-Disposition", `attachment; filename="${user.resume.filename}"`);

    downloadStream.pipe(res);

    downloadStream.on("error", () => {
      res.status(404).json({ message: "Resume not found" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 */
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Find user first to delete resume
    const user = await User.findById(userId);
    if (user && user.resume?.fileId) {
      await deleteOldResume(user.resume.fileId);
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;