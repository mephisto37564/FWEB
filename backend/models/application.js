import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    // field: title, data type: string, validation rules: required
    title: {
      type: String,
      required: true,
    },

    // field: company, data type: string, validation rules: required
    company: {
      type: String,
      required: true,
    },

    // field: duration, data type: string
    duration: {
      type: String,
    },

    // field: description, data type: string (optional)
    description: {
      type: String,
    },

    // field: userId, reference to User model
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

// Export application model
export default mongoose.model("Applications", applicationSchema);