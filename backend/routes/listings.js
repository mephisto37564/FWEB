import express from "express";
import Listing from "../models/listings.js";

const router = express.Router();

/**
 * @swagger
 * /listings:
 *   post:
 *     summary: Create a new job listing
 *     description: Creates a new job listing with the provided details
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
 *       201:
 *         description: Listing created successfully
 *       400:
 *         description: Bad request - validation error
 *       500:
 *         description: Server error
 */
router.post("/", async (req, res) => {
  try {
    // Get listing data from request body
    const { title, company, duration, description } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!company) {
      return res.status(400).json({ message: "Company is required" });
    }

    // Create a new listing instance
    const newListing = new Listing({
      title,
      company,
      duration,
      description,
    });

    // Save the new listing to the database
    const savedListing = await newListing.save();

    // Return success response
    res.status(201).json(savedListing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /listings:
 *   get:
 *     summary: Get all job listings
 *     description: Retrieves a list of all available job listings
 *     responses:
 *       200:
 *         description: Successfully retrieved all listings
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
    // Fetch all listings from the database
    const listings = await Listing.find();
    res.status(200).json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /listings/{id}:
 *   get:
 *     summary: Get a listing by ID
 *     description: Retrieves a specific job listing by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The listing ID
 *     responses:
 *       200:
 *         description: Successfully retrieved the listing
 *       404:
 *         description: Listing not found
 *       500:
 *         description: Server error
 */
router.get("/:id", async (req, res) => {
  try {
    // Get listing ID from req.params.id
    const listingId = req.params.id;

    // Fetch the specific listing from the database
    const listing = await Listing.findById(listingId);

    // If listing not found, return 404
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Return the listing
    res.json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /listings/{id}:
 *   put:
 *     summary: Update a job listing
 *     description: Updates an existing job listing by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The listing ID
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
 *         description: Listing updated successfully
 *       404:
 *         description: Listing not found
 *       500:
 *         description: Server error
 */
router.put("/:id", async (req, res) => {
  try {
    // Get listing ID from req.params.id
    const listingId = req.params.id;

    // Get updated data from req.body
    const updatedData = req.body;

    // Update the listing in the database
    const updatedListing = await Listing.findByIdAndUpdate(
      listingId,
      updatedData,
      { new: true, runValidators: true } // return updated doc and run schema validators
    );

    // If listing not found, return 404
    if (!updatedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Return the updated listing
    res.json(updatedListing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /listings/{id}:
 *   delete:
 *     summary: Delete a job listing
 *     description: Deletes a job listing by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The listing ID
 *     responses:
 *       200:
 *         description: Listing deleted successfully
 *       404:
 *         description: Listing not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", async (req, res) => {
  try {
    // Get listing ID from request parameters
    const listingId = req.params.id;

    // Remove the listing from the database
    const deletedListing = await Listing.findByIdAndDelete(listingId);

    // If listing not found, return 404
    if (!deletedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Return success message
    res.json({ message: "Listing deleted successfully", listing: deletedListing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;