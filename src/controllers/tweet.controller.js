import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body
    const tweet = await Tweet.create({ content, owner: req.user._id })
    return res.status(201).json(new ApiResponse(201, tweet, "Tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params
    const tweets = await Tweet.find({ owner: userId }).populate("owner", "username fullName avatar")
    return res.status(200).json(new ApiResponse(200, tweets, "User tweets fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params
    const { content } = req.body
    const tweet = await Tweet.findOneAndUpdate({ _id: tweetId, owner: req.user._id }, { content }, { new: true })
    if (!tweet) {
        throw new ApiError(404, "Tweet not found or you are not the owner of the tweet")
    }
    return res.status(200).json(new ApiResponse(200, tweet, "Tweet updated successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params
    const tweet = await Tweet.findOneAndDelete({ _id: tweetId, owner: req.user._id })
    if (!tweet) {
        throw new ApiError(404, "Tweet not found or you are not the owner of the tweet")
    }
    return res.status(200).json(new ApiResponse(200, null, "Tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}