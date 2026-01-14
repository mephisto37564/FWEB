import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// Import routes
import listingsRouter from "./routes/listings.js";
import applicationsRouter from "./routes/applications.js";
import usersRouter from "./routes/users.js";

// Load environment variables from .env
dotenv.config();

const app = express();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Internship Portal API",
      version: "1.0.0",
      description: "API documentation for the Internship Portal application",
    },
  },
  apis: ["./routes/*.js"], // Path to your API route files
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Enables CORS so your front-end can access your backend API without browser blocking it.
app.use(cors());

// Allows Express to parse JSON data from incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mount all the API route endpoints under specific base paths
app.use("/listings", listingsRouter);
app.use("/applications", applicationsRouter);
app.use("/users", usersRouter);

// Initial route to test if your backend server is running properly
app.get("/", async (req, res) => {
  res.send(
    "<h1>Welcome to the Internship Portal API! The server is running successfully.</h1>"
  );
});

// Set port
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});