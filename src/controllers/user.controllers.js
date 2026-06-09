import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import {uploadCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from "jsonwebtoken";
import fs from "fs";


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave : false});

        return {accessToken, refreshToken};

    } catch (error) {
        console.error("CRITICAL ERROR IN TOKEN GENERATION:", error);
        
        throw new ApiError(500, error?.message || "Something went wrong while generating tokens");
    }
}


const registerUser = asyncHandler( async(req, res) => {
    try {
        const {username, email, password, fullName} = req.body;
        if([fullName, username, password, email].some((field) => !field || field.trim() === "")){
            throw new ApiError(400, "all fields are required");
        }

        const userExist = await User.findOne({
            $or : [{email}, {username}]
        })

        if(userExist){
            throw new ApiError(409, "user already exists with this username or email");
        }

        const avatarLocalPath = req.files?.avatar?.[0]?.path;
        const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
        
        if(!avatarLocalPath){
            throw new ApiError(400, "avatar image is required")
        }
        
        const avatar = await uploadCloudinary(avatarLocalPath)
        const coverImage = await uploadCloudinary(coverImageLocalPath)
        
        if(!avatar){
            throw new ApiError(400, "avatar image upload failed")
        }

        const user = await User.create({
            fullName,
            email,
            avatar : avatar.url,
            coverImage : coverImage?.url || "",
            password,
            username: username.toLowerCase()
        })

        const createdUser =  await User.findById(user._id).select(
            "-password -refreshToken"
        )

        if(!createdUser){
            throw new ApiError(500, "something went wrong while registering the user")
        }

        return res.status(201).json(
            new ApiResponse(201, createdUser, "Registration successful")
        );
    } catch (error) {
        // Clean up any uploaded local files on failure
        if (req.files) {
            const files = Object.values(req.files).flat();
            for (const file of files) {
                if (file.path && fs.existsSync(file.path)) {
                    try {
                        fs.unlinkSync(file.path);
                    } catch (unlinkError) {
                        console.error("Failed to delete temp file:", unlinkError);
                    }
                }
            }
        }
        throw error;
    }
})

const loginUser = asyncHandler(async(req,res)=>{
    const {username, email, password} = req.body;
    if(!(username || email)){
        throw new ApiError(400, "email or username required");
    }
    if(!password){
        throw new ApiError(400, "password is required");
    }

    const user = await User.findOne({
        $or : [{email}, {username}]
    })

    if(!user){
        throw new ApiError(404, "user does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401, "invalid login credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly : true,
        secure : true
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {user : loggedInUser, accessToken, refreshToken}, "user logged in successfully"))
})

const logoutUser = asyncHandler(async(req,res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set :{
                refreshToken : undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out successfully"))
})

const refreshAccessToken = asyncHandler(async(req, res) => {
    const refreshTokenFromClient = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "");

    if(!refreshTokenFromClient){
        throw new ApiError(401, "unauthorised request")
    }

    try {
        const decodedToken = jwt.verify(refreshTokenFromClient, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);

        if(!user){
            throw new ApiError(401, "invalid refresh token")
        }

        if(refreshTokenFromClient !== user?.refreshToken){
            throw new ApiError(401, "refresh token is expired or used")
        }

        const {accessToken, refreshToken: newRefreshToken} = await generateAccessAndRefreshToken(user._id);

        const options = {
            httpOnly : true,
            secure : true
        }

        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(new ApiResponse(200, {accessToken, refreshToken: newRefreshToken}, "refresh token generated successfully"))

    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token")
    }
})

export {registerUser, loginUser, logoutUser, refreshAccessToken, generateAccessAndRefreshToken};