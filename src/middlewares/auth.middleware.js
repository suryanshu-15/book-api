import { Admin } from "../models/admin.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const verifyRole = asyncHandler( async (req, _, next) => {
  try {
    const id = req.cookies?.adminId
    //  console.log(id)
     const admin = await Admin.findById(id)
  
    if (!admin) {
      throw new ApiError(401, "invalid access please login as admin");
    }
  
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid token")
  }
});
