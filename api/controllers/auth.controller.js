import User from "../models/user.model.js"
import bcyrptjs from "bcryptjs"
import { errorHandler } from "../utils/error.js"
import jwt from "jsonwebtoken"

//middleware created in index.js is used here using next
export const signup = async (req, res, next) => {
	const { username, email, password } = req.body
	//hashSync includes the await function so we do not need to add ourself
	const hashedPassword = bcyrptjs.hashSync(password, 10)
	const newUser = new User({ username, email, password: hashedPassword })

	try {
		await newUser.save()
		// only newUser.save() will take a lot of time to prevent it async and await is used
		res.status(201).json("User created successfully!!")
	} catch (err) {
		next(err)
		//the below code is written manually from the utils
		// next(errorHandler(500,"Error from the Function"))
	}
}

export const signin = async (req, res, next) => {
	const { email, password } = req.body
	try {
		const validUser = await User.findOne({ email })
		if (!validUser) {
			return next(errorHandler(404, "User not Found!!"))
		}
		const validPassword = bcyrptjs.compareSync(password, validUser.password)
		if (!validPassword) {
			return next(errorHandler(401, "Wrong Credentials!!"))
		}
		//here except password we will get everything regarding the user
		const { password: hashedPassword, ...rest } = validUser._doc
		const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
		res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest)
	} catch (err) {
		next(err)
	}
}
export const google = async (req, res, next) => {
	try {
		const user = await User.findOne({ email: req.body.email })
		if (user) {
			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
			const { password: hashedPassword, ...rest } = user._doc
			res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest)
		} else {
			//here password is generated manually as password is required according to the User model, and while using google password is not required as authentication is done by google so to remove the error this below line of code is used
			//here 36 means alphabets from a-z, A-Z and digits from 0-9 and -8 means we need only last 8 value of password
			// Math.random() is used two times to create a password of 16 digits using only one means 8 digits, also 16 digits is more secure
			const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
			const hashPassword = bcyrptjs.hashSync(generatedPassword, 10)
			//to convert Ramneet Kaur into ramneetkaur84fd the below code is written in username
			const newUser = new User({ username: req.body.name, email: req.body.email, password: hashPassword, avatar: req.body.photo })
			await newUser.save()
			const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
			const { password: hashedPassword, ...rest } = newUser._doc
			res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest)
		}
	} catch (error) {
		next(error)
	}
}

export const signOut = async (req, res, next) => {
	try {
		res.clearCookie("access_token")
		res.status(200).json("User has been logged out!")
	} catch (error) {
		next(error)
	}
}
