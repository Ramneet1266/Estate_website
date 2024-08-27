//this middleware is created where we want to provide manual error like password is not long enough etc.
export const errorHandler = (statusCode, message) => {
	const error = new Error()
	error.statusCode = statusCode
	error.message = message
	return error
}
