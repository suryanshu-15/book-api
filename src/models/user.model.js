import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"


const userSchema = new Schema(
  {
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
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      default: 'User',
    },
    
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", async function (next){
  if(!this.isModified("password")) return next();

  this.password = bcrypt.hash(this.password, 10)
  console.log(this.password)
  next()

})

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema)
