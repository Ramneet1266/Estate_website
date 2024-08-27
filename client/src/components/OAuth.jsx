import React from "react"
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import { app } from "../firebase"
import { useDispatch } from "react-redux"
import { signInSuccess } from "../redux/user/userSlice"
import { useNavigate } from "react-router-dom"

export default function OAuth() {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	//for using google we need to use firebase
	const handleGoogleClick = async () => {
		try {
			const provider = new GoogleAuthProvider()
			const auth = getAuth(app)

			//this line of code will popup the google authentication(which is used to sign in)
			const result = await signInWithPopup(auth, provider)
			const res = await fetch("/api/auth/google", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ name: result.user.displayName, email: result.user.email, photo: result.user.photoURL })
			})
			const data = await res.json()
			dispatch(signInSuccess(data))
			navigate("/")
		} catch (error) {
			console.log("Could not sign in with Google", error)
		}
	}
	//type is set to button to prevent this button to submit the form
	return (
		<button onClick={handleGoogleClick} type="button" className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
			continue with google
		</button>
	)
}
