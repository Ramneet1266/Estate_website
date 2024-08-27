import React, { useEffect, useState } from "react"
import { FaSearch } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

export default function Header() {
	const { currentUser } = useSelector((state) => state.user)
	const [searchTerm, setSearchTerm] = useState("")
	const navigate = useNavigate()
	const handleSubmit = (e) => {
		e.preventDefault()
		//this line of code will keep the url searches same and only update the one which is being called rest keeping the queries in the url same
		const urlParams = new URLSearchParams(window.location.search)
		urlParams.set("searchTerm", searchTerm)
		const searchQuery = urlParams.toString()
		navigate(`/search?${searchQuery}`)
	}

	//this useEffect will change the value of search bar in the web application according to the changes done in the url
	useEffect(() => {
		const urlParams = new URLSearchParams(location.search)
		const searchTermFromUrl = urlParams.get("searchTerm")
		if (searchTermFromUrl) {
			setSearchTerm(searchTermFromUrl)
		}
	}, [location.search])
	return (
		<header className="bg-slate-200 shadow-md">
			<div className="flex justify-between items-center max-w-6xl mx-auto p-3">
				<Link to="/">
					<h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
						<span className="text-slate-500">SHAH</span>
						<span className="text-slate-700">Estate</span>
					</h1>
				</Link>
				<form
					onSubmit={handleSubmit}
					className="bg-slate-100 p-3 rounded-lg flex items-center"
				>
					<input
						type="text"
						placeholder="Search..."
						className="bg-transparent focus:outline-none w-24 sm:w-64"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					{/* focus:outline-none here means text-decoration none and here w-24 and sm:w-64 are for mobile and after mobile respectively for medium use md:property*/}
					<button>
						<FaSearch className="text-slate-600" />
					</button>
				</form>
				<ul className="flex gap-4">
					<Link to="/">
						<li className="hidden sm:inline text-slate-700 hover:underline">
							Home
						</li>
					</Link>
					<Link to="/about">
						<li className="hidden sm:inline text-slate-700 hover:underline">
							About
						</li>
					</Link>
					<Link to="/profile">
						{currentUser ? (
							<img
								className="rounded-full h-7 w-7 object-cover"
								src={currentUser.avatar}
								alt="profile pic"
							/>
						) : (
							<li className="text-slate-700 hover:underline">
								Sign in
							</li>
						)}
					</Link>
				</ul>
			</div>
		</header>
	)
}
