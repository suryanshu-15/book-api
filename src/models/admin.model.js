import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"


const adminSchema = new Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Valid email format
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['Admin'],
      default: 'Admin',
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);

adminSchema.pre("save", async function (next){
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10)
  next()

})

adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};



export const Admin = mongoose.model("Admin", adminSchema)
