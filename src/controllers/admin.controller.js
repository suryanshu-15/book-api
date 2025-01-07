import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Admin } from "../models/admin.model.js";
import { Book } from "../models/books.model.js";
import { ApiError } from "../utils/ApiError.js";

// Register Admin
const registerAdmin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Some fields are missing");
  }

  const existedUser = await Admin.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  const admin = await Admin.create({ username, email, password });

  const createdAdmin = await Admin.findById(admin._id).select("-password -refreshtoken");

  if (!createdAdmin) throw new ApiError(500, "Error while creating admin");

  return res.status(201).json(
    new ApiResponse(201, createdAdmin, "Admin registered successfully")
  );
});

// Login Admin
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const admin = await Admin.findOne({ email });
  console.log(admin)

  if (!admin || !(await admin.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const options = {
    httpOnly: true,
    secure: true,
}

  return res.status(200)
  .cookie("adminId", admin._id, options)
  .json(
    new ApiResponse(200,  "Login successful")
  );
});

const logoutAdmin = asyncHandler( async(req,res) => {
  
  const options = {
      httpOnly: true,
      secure: true,
  }

  return res
  .status(200)
  .clearCookie("adminId", options)
  .json(new ApiResponse(200, {}, "User logged out"))

})

// Create Book
const createBook = asyncHandler(async (req, res) => {
  const { bookname, author, type, price, stock, rating } = req.body;

  if ([bookname, author, type, price, stock, rating].some((field) => field === undefined || field === null || (typeof field === "string" && field.trim() === ""))) {
    throw new ApiError(400, "Some fields are missing");
  }

  const book = await Book.create({ bookname, author, type, price, stock, rating });

  return res.status(201).json(
    new ApiResponse(201, book, "Book created successfully")
  );
});

// Update Book
const updateBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { bookname, author, type, price, stock, rating } = req.body;

  const book = await Book.findByIdAndUpdate(
    id,
    { bookname, author, type, price, stock, rating },
    { new: true }
  );

  if (!book) throw new ApiError(404, "Book not found");

  return res.status(200).json(
    new ApiResponse(200, book, "Book updated successfully")
  );
});

// Read Book
const readBook = asyncHandler(async (req, res) => {
  const books = await Book.find();

  return res.status(200).json(
    new ApiResponse(200, books, "Books retrieved successfully")
  );
});

// Delete Book
const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const book = await Book.findByIdAndDelete(id);

  if (!book) throw new ApiError(404, "Book not found");

  return res.status(200).json(
    new ApiResponse(200, book, "Book deleted successfully")
  );
});

export { registerAdmin, loginAdmin, createBook, updateBook, readBook, deleteBook, logoutAdmin };
