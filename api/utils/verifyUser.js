import { errorHandler } from "./error.js"
import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
	const token = req.cookies.access_token

	if (!token) return next(errorHandler(401, "Unauthorized"))

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) return next(errorHandler(403, "Forbidden"))

		// the user is passed on to the next function which was got by the token (next function is the updateUser present in teh user.controller.js)
		req.user = user
		next()
	})
}
