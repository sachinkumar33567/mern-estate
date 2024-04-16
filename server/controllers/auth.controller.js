import User from '../models/user.model.js'
import {errorHandler} from '../utils/error.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
    let {username, email, password} = req.body

    if (!username || !email || !password) {
        return next(errorHandler(404, 'All fields are required!'))
    }
    if (username.includes(' ')) {
        username = username.split(' ').join('').toLowerCase() + Math.random().toString(9).slice(-3)
    }

    const hashedPassword = bcryptjs.hashSync(password, 10)
    const newUser = new User({username, email, password: hashedPassword})
    try {
        await newUser.save()
        res.status(201).json('User signed up successfully.')        
    } catch (error) {
        next(error)
    }
}

export const signin = async (req, res, next) => {
    const {email, password} = req.body

    if (!email || !password) {
        return next(errorHandler(404, 'All fields are required!'))
    }

    try {
        const validUesr = await User.findOne({email})
        if (!validUesr) return next(errorHandler(404, 'User not found!'))
        const validPassword = bcryptjs.compareSync(password, validUesr.password)
        if (!validPassword) return next(errorHandler(401, 'Invalid password!'))
        
        const {password: pass, ...rest} = validUesr._doc
        const token = jwt.sign({id: validUesr._id}, process.env.JWT_SECRET)
        res
        .cookie('access_token', token, {httpOnly: true})
        .status(200)
        .json(rest)
    } catch (error) {
        next(error)
    }

}

export const google = async (req, res, next) => {
    const {name, email, googlePhoto} = req.body
    try {
        const user = await User.findOne({email})
        if (user) {
            const {password: pass, ...rest} = user._doc
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
            res
            .cookie('access_token', token, {httpOnly: true})
            .status(200)
            .json(rest)
        } else {
            const username = name.split(' ').join('').toLowerCase() + Math.random().toString(9).slice(-3)
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)
            const newUser = new User({username, email, password: hashedPassword, profilePicture: googlePhoto})

            await newUser.save()
            const {password: pass, ...rest} = newUser._doc
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET)
            res
            .cookie('access_token', token, {httpOnly: true})
            .status(200)
            .json(rest)
        }
    } catch (error) {
        next(error)
    }
}

export const signout = (req, res, next) => {
    try {
        res.clearCookie('access_token')
        res.status(200).json("You've been logged out")
    } catch (error) {
        next(error)
    }
}