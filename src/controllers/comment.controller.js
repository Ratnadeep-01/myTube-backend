import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const comments = await Comment.find({video: videoId})
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("owner", "name avatar")
    const totalComments = await Comment.countDocuments({video: videoId})
    return res.status(200).json(new ApiResponse(200, {comments, totalComments}, "Comments fetched successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {text} = req.body
    const comment = await Comment.create({video: videoId, owner: req.user._id, content: text})
    return res.status(201).json(new ApiResponse(201, comment, "Comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {text} = req.body
    const comment = await Comment.findOneAndUpdate({_id: commentId, owner: req.user._id}, {content: text}, {new: true})
    if (!comment) {
        throw new ApiError(404, "Comment not found or you are not the owner of the comment")
    }
    return res.status(200).json(new ApiResponse(200, comment, "Comment updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    const comment = await Comment.findOneAndDelete({_id: commentId, owner: req.user._id})
    if (!comment) {
        throw new ApiError(404, "Comment not found or you are not the owner of the comment")
    }
    return res.status(200).json(new ApiResponse(200, null, "Comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }