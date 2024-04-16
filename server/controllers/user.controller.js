import Listing from "../models/listing.model.js"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'

export const test = (req, res) => {
    res.send('Hello World!')
}


export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can only update your own account!'))
    }
    
    const {username, email, password, profilePicture} = req.body
    console.log(username)

    if (username && (username.length < 7 || username.length > 20)) {
        return next(errorHandler(400, 'Username must be in between 7 and 20 characters'))
    }
    if (username && username.includes(' ')) {
        return next(errorHandler(400, "Username can't contain spaces"))
    }
    
    if (username && !username.match(/^[a-zA-Z0-9]+$/)) {
        return next(errorHandler(400, 'Username can contains only letters and numbers'))
    }

    if (password) {
        if (password.length < 6) {
            return next(errorHandler(400, 'Password must be of 6 characters'))
        }

        req.body.password = bcryptjs.hashSync(password, 10)
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: username ? username.toLowerCase() : username,
                email,
                password: req.body.password,
                profilePicture
            }
        }, {new: true})

        const {password, ...rest} = updatedUser._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}


export const delteteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can only delete your own account!'))
    }

    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie('access_token')
        res.status(200).json('User has been deleted successfully')
    } catch (error) {
        next(error)
    }
}


export const getListings = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler('You can only view your own listings!'))
    }

    try {
        const listings = await Listing.find({userRef: req.params.id})
        res.status(200).json(listings)
    } catch (error) {
        next(error)
    }
}


export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return next(errorHandler(404, 'User not found!'))
        }

        const {password: pass, ...rest} = user._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}