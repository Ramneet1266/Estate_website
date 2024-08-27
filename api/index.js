import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import listingRouter from "./routes/listing.route.js"
//cookie-parser is a library which is used to get any data from the backend
import cookieParser from "cookie-parser"

dotenv.config()
const app = express()

mongoose
	.connect(process.env.MONGO)
	.then(() => {
		console.log("Connected to MongoDB!")
	})
	.catch((err) => {
		console.log(err)
	})

//MIDDLEWARE
//to send the json file to the backend this below code statement is used
app.use(express.json())
app.use(cookieParser())

app.listen(6000, () => {
	console.log("Server is running on port 6000")
})

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/listing", listingRouter)

//this code is written to decrease the lines of code for errors as errors will occur in every control and to avoid writing the same code again and again this middleware is created
app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500
	const message = err.message || "Internal Server Error"
	return res.status(statusCode).json({
		success: false,
		statusCode,
		message,
	})
})
