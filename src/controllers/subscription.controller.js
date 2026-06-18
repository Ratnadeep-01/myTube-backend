import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const channel = await User.findById(channelId)
    if (!channel) {
        throw new ApiError(404, "Channel not found")
    }
    const subscription = await Subscription.findOne({ channel: channelId, subscriber: req.user._id })
    if (subscription) {
        await Subscription.deleteOne({ channel: channelId, subscriber: req.user._id })
        return res.status(200).json(new ApiResponse(200, { subscribed: false }, "Unsubscribed successfully"))
    } else {
        await Subscription.create({ channel: channelId, subscriber: req.user._id })
        return res.status(200).json(new ApiResponse(200, { subscribed: true }, "Subscribed successfully"))
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const channel = await User.findById(channelId)
    if (!channel) {
        throw new ApiError(404, "Channel not found")
    }
    const subscribers = await Subscription.find({ channel: channelId }).populate("subscriber", "username fullName avatar")
    return res.status(200).json(new ApiResponse(200, subscribers, "Subscriber list fetched successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    const channels = await Subscription.find({ subscriber: subscriberId }).populate("channel", "username fullName avatar")
    return res.status(200).json(new ApiResponse(200, channels, "Subscribed channels fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}