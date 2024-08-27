import Listing from "../models/listing.model.js"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcrypts from "bcryptjs"

export const updateUser = async (req, res, next) => {
	if (req.user.id !== req.params.id)
		return next(
			errorHandler(401, "You can only update your own account")
		)
	try {
		if (req.body.password) {
			res.body.password = bcrypts.hashSync(req.body.password, 10)
		}
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				//set is used to only update the things done by user and ignoring the rest...also in set ...req.body is not used as this will contain isAdmin which holds the authority to do bigger things...so to make the user unable to change the isAdmin value all other properites are written
				$set: {
					username: req.body.username,
					email: req.body.email,
					password: req.body.password,
					avatar: req.body.avatar,
				},
			},
			//new:true is going the return and save this updated user with the new information not the previous one
			{ new: true }
		)
		const { password, ...rest } = updatedUser._doc
		res.status(200).json(rest)
	} catch (err) {
		next(err)
	}
}

export const deleteUser = async (req, res, next) => {
	if (req.user.id !== req.params.id)
		return next(
			errorHandler(401, "You can only update your own account")
		)

	try {
		await User.findByIdAndDelete(req.params.id)
		res.clearCookie("access_token")
		res.status(200).json("User has be deleted!")
	} catch (error) {
		next(error)
	}
}

export const getUserListing = async (req, res, next) => {
	if (req.user.id === req.params.id) {
		try {
			const listings = await Listing.find({ userRef: req.params.id })
			res.status(200).json(listings)
		} catch (error) {
			next(error)
		}
	} else {
		return nect(
			errorHandler(401),
			"You can only view our own listing"
		)
	}
}

export const getUser = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id)
		if (!user) {
			return next(errorHandler(404, "User not found!!"))
		}
		const { password: pass, ...rest } = user._doc
		res.status(200).json(rest)
	} catch (error) {
		next(error)
	}
}
