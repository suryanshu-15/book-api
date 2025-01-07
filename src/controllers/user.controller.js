import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Book } from "../models/books.model.js";

const registerUser = asyncHandler( async(req,res) => {
    const {fullname, email, username, password, address}= req.body
    console.log("email: ", email)
    console.log(username)

    if(
        [fullname, email, username, password].some((field) => field?.trim() === ""))
        {
        throw new ApiError(400,"full name is required")
    }


    const existedUser = await User.findOne({
        $or: [{email}, {username}]
    })
    
    if(existedUser) {
        throw new ApiError(409, "user with email or user name already user")
    }
    

    const user = await User.create({
        username,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password"
    )

    if(!createdUser){
        throw new ApiError(500, "error while registering")
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registeres successfully")
    )
})

const loginUser = asyncHandler( async(req,res) => {
        
    const {email,password,fullname} = req.body;

    if(!(email || fullname)) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{fullname},{email}]
    })
    // console.log(user)

    if(!user){
        throw new ApiError(404, "user does not exist")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if(!isPasswordCorrect){
        throw new ApiError(401, "invalid password")
    }

    const logedInUser = await User.findById(user._id).select("-password -refreshToken")


    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {
                user: logedInUser,
            },
            "User logged in successfully"
        ) 
    )
})

const readBook = asyncHandler(async(req,res)=>{
    const books = await Book.find();

    return res.status(200).json(
      new ApiResponse(200, books, "Books retrieved successfully")
    );
})




export {
    registerUser,
    loginUser,
    readBook
}