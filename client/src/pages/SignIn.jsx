import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice"
import OAuth from "../components/OAuth"

export default function SignIn() {
	const dispatch = useDispatch()
	const [formData, setFormData] = useState({})
	// instead of importing loading and error separately we are importing them from the userSlice.js
	// const [error, setError] = useState(null)
	// const [loading, setLoading] = useState(false)
	const { loading, error } = useSelector(state => state.user)
	const navigate = useNavigate()
	const handleChange = e => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value
		})
	}
	const handleSubmit = async e => {
		e.preventDefault()
		try {
			//instead of using the below code of line reducer is used
			// setLoading(true)
			dispatch(signInStart())

			const res = await fetch("/api/auth/signin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(formData)
			})
			const data = await res.json()
			if (data.success === false) {
				// setError(data.message)
				// setLoading(false)
				dispatch(signInFailure(data.message))
				return
			}
			// setLoading(false)
			// setError(null)
			dispatch(signInSuccess(data))
			navigate("/")
		} catch (error) {
			// setLoading(false)
			// setError(error.message)
			dispatch(signInFailure(error.message))
		}
	}
	console.log(formData)
	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<input type="email" placeholder="Email" className="border p-3 rounded-lg" id="email" onChange={handleChange} />
				<input type="password" placeholder="Password" className="border p-3 rounded-lg" id="password" onChange={handleChange} />
				<button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opcaity-80">
					{loading ? "Loading..." : "Sign In"}
				</button>
				<OAuth />
			</form>
			<div className="flex gap-2 mt-5">
				<p>Dont have an account?</p>
				<Link to={"/sign-up"}>
					<span className="text-blue-700">Sign up</span>
				</Link>
			</div>
			{error && <p className="text-red-500">{error}</p>}
		</div>
	)
}
