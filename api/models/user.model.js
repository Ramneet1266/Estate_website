import mongoose from "mongoose"

const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true
		},
		avatar: {
			type: String,
			default: "https://imgs.search.brave.com/ma7sEjlAFcmBAqpdxMvbQfehHQhOJ3dq-l8rWJdCTq0/rs:fit:860:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAwLzY0LzY3LzYz/LzM2MF9GXzY0Njc2/MzgzX0xkYm1oaU5N/NllwemIzRk00UFB1/RlA5ckhlN3JpOEp1/LmpwZw"
		}
	},
	{ timestamps: true }
)
//timestamps provide two types of info first is the date when user will create the id and one more which will provide the date when the user will update his id

const User = mongoose.model("User", userSchema)

export default User
