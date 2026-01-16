import express from "express";
import mongoose from "mongoose";
import Applications from "../models/application.js";
import Listings from "../models/listings.js";
import Users from "../models/users.js";

const router = express.Router();

/**
 * @swagger
 * /dashboard/user/{userId}:
 *   get:
 *     summary: Get user dashboard data
 *     description: Retrieve aggregated application data for a specific user including total applications, applications by company, timeline data, and recent applications
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: User dashboard data
 */
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate if userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    // 1. Total applications for this user
    const totalApplications = await Applications.countDocuments({
      userId: objectId,
    });

    // 2. Applications by company
    const applicationsByCompany = await Applications.aggregate([
      {
        $match: {
          userId: objectId,
        },
      },
      {
        $group: {
          _id: "$company",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // 3. Timeline data (applications by month)
    const timelineData = await Applications.aggregate([
      {
        $match: {
          userId: objectId,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $project: {
          _id: 0,
          month: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: 1,
            },
          },
          count: 1,
        },
      },
    ]);

    // 4. Recent applications (last 5)
    const recentApplications = await Applications.find({ userId: objectId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalApplications,
      applicationsByCompany: applicationsByCompany.map((item) => ({
        name: item._id,
        count: item.count,
      })),
      timelineData: timelineData.map((item) => ({
        date: item.month,
        applications: item.count,
      })),
      recentApplications,
    });
  } catch (error) {
    console.error("Error fetching user dashboard data:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data", details: error.message });
  }
});

/**
 * @swagger
 * /dashboard/admin:
 *   get:
 *     summary: Get admin dashboard data
 *     description: Retrieve platform-wide aggregated data including total listings, total applications, most popular listings, timeline data for all applications, and job categories distribution
 *     responses:
 *       200:
 *         description: Admin dashboard data
 */
router.get("/admin", async (req, res) => {
  try {
    // 1. Total listings
    const totalListings = await Listings.countDocuments();

    // 2. Total applications
    const totalApplications = await Applications.countDocuments();

    // 3. Most applied listings (top 5)
    const mostAppliedListings = await Applications.aggregate([
      {
        $group: {
          _id: "$title",
          company: { $first: "$company" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          _id: 0,
          title: "$_id",
          company: 1,
          applications: "$count",
        },
      },
    ]);

    // 4. Timeline data (all applications by month)
    const timelineData = await Applications.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $project: {
          _id: 0,
          month: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: 1,
            },
          },
          count: 1,
        },
      },
    ]);

    // 5. Job categories distribution (using title as category)
    const jobCategoriesDistribution = await Applications.aggregate([
      {
        $group: {
          _id: "$title",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: "$count",
        },
      },
    ]);

    // 6. User engagement metrics (total unique users who applied)
    const totalActiveUsers = await Applications.aggregate([
      {
        $group: {
          _id: "$userId",
        },
      },
      {
        $count: "total",
      },
    ]);

    res.json({
      totalListings,
      totalApplications,
      totalActiveUsers: totalActiveUsers[0]?.total || 0,
      mostAppliedListings,
      timelineData: timelineData.map((item) => ({
        date: item.month,
        applications: item.count,
      })),
      jobCategoriesDistribution,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data", details: error.message });
  }
});

export default router;