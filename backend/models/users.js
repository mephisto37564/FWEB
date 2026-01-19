import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Store resume file info (GridFS reference)
    resume: {
      fileId: mongoose.Schema.Types.ObjectId,  // GridFS file ID
      filename: String,                         // Original filename
      mimetype: String,                         // File type (application/pdf, etc)
      uploadDate: Date,                         // When uploaded
      size: Number                              // File size in bytes
    },
  },
  { timestamps: true }
);

export default mongoose.model("Users", userSchema);