import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // field: name, data type: string, validation rules: required
    name: {
      type: String,
      required: true,
    },

    // field: email, data type: string, validation rules: required, unique
    email: {
      type: String,
      required: true,
      unique: true,
    },

    // field: password, data type: string, validation rules: required
    password: {
      type: String,
      required: true,
    },

    // field: role, data type: string, default: 'user', enum: ['user', 'admin']
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // field: resume, data type: string (optional)
    resume: {
      type: String,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

// Export user model
export default mongoose.model("Users", userSchema);
