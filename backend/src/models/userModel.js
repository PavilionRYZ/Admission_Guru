import mongoose from "mongoose";
import bcrypt from "bcrypt";

// User Schema
const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    provider: {
      type: String,
      enum: ["google", "local", "hybrid"],
      default: "local",
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      required: false,
    },
    password: {
      type: String,
      required: false,
      minlength: 6,
      validate: {
        validator: function (value) {
          if (!value || value.startsWith("$2b$")) {
            return true;
          }
          return value.length <= 12;
        },
        message:
          "Password must be between 6 and 12 characters long before hashing",
      },
    },
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    applicationHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ApplicationHistory",
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true },
);

// Password hashing middleware
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password comparison method
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    throw new Error("Password not set for this user");
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
