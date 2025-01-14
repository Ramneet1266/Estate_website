import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ListingItem from "../components/ListingItem"

export default function Search() {
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false)
	const [listing, setListing] = useState([])
	const [showMore, setShowMore] = useState(false)
	// console.log(listing)

	const [sideBarSearch, setSideBarSearch] = useState({
		searchTerm: "",
		offer: false,
		parking: false,
		furnished: false,
		type: "all",
		sort: "created_At",
		order: "desc",
		startIndex: 1,
	})
	const handleChange = (e) => {
		if (
			e.target.id === "all" ||
			e.target.id === "rent" ||
			e.target.id === "sale"
		) {
			setSideBarSearch({ ...sideBarSearch, type: e.target.id })
		}
		if (e.target.id === "searchTerm") {
			setSideBarSearch({
				...sideBarSearch,
				searchTerm: e.target.value,
			})
		}
		if (
			e.target.id === "parking" ||
			e.target.id === "furnished" ||
			e.target.id === "offer"
		) {
			//here e.target.checked || e.target.checked === 'true'? 'true': 'false' this line is used to store the value of boolean and string into the e.target.id...here string value can be obtain from url and boolean value from the checkboxes so to prevent the error this line is used
			setSideBarSearch({
				...sideBarSearch,
				[e.target.id]:
					e.target.checked || e.target.checked === "true"
						? true
						: false,
			})
		}
		if (e.target.id === "sort_order") {
			const sort = e.target.value.split("_")[0] || "created_At"
			const order = e.target.value.split("_")[1] || "desc"
			setSideBarSearch({ ...sideBarSearch, sort, order })
		}
	}
	useEffect(() => {
		const urlParams = new URLSearchParams(location.search)
		const searchTermFromUrl = urlParams.get("searchTerm")
		const typeFromUrl = urlParams.get("type")
		const parkingFromUrl = urlParams.get("parking")
		const furnishedFromUrl = urlParams.get("furnished")
		const offerFromUrl = urlParams.get("offer")
		const sortFromUrl = urlParams.get("sort")
		const orderFromUrl = urlParams.get("order")

		if (
			searchTermFromUrl ||
			typeFromUrl ||
			parkingFromUrl ||
			furnishedFromUrl ||
			offerFromUrl ||
			sortFromUrl ||
			orderFromUrl
		) {
			setSideBarSearch({
				searchTerm: searchTermFromUrl || "",
				type: typeFromUrl || "all",
				parking: parkingFromUrl === "true" ? true : false,
				furnished: furnishedFromUrl === "true" ? true : false,
				offer: offerFromUrl === "true" ? true : false,
				sort: sortFromUrl || "created_At",
				order: orderFromUrl || "desc",
			})
		}
		const fetchListing = async () => {
			setLoading(true)
			setShowMore(false)
			const searchQuery = urlParams.toString()
			const res = await fetch(`/api/listing/get?${searchQuery}`)
			const data = await res.json()
			if (data.length > 8) {
				setShowMore(true)
			} else {
				setShowMore(false)
			}
			setListing(data)
			setLoading(false)
		}
		fetchListing()
	}, [location.search])
	const handleSubmit = (e) => {
		e.preventDefault()
		const urlParams = new URLSearchParams()
		urlParams.set("searchTerm", sideBarSearch.searchTerm),
			urlParams.set("type", sideBarSearch.type),
			urlParams.set("parking", sideBarSearch.parking),
			urlParams.set("furnished", sideBarSearch.furnished),
			urlParams.set("offer", sideBarSearch.offer),
			urlParams.set("sort", sideBarSearch.sort),
			urlParams.set("order", sideBarSearch.order)
		const searchQuery = urlParams.toString()
		navigate(`/search?${searchQuery}`)
	}
	const onShowMoreClick = async () => {
		const numberOfListings = listing.length
		const startIndex = numberOfListings
		const urlParams = new URLSearchParams(location.search)
		urlParams.set("startIndex", startIndex)

		const searchQuery = urlParams.toString()
		const res = await fetch(`/api/listing/get?${searchQuery}`)
		const data = await res.json()
		console.log(data)
		if (data.length < 9) {
			setShowMore(false)
		}
		setListing([...listing, ...data])
	}
	return (
		<div className="flex flex-col md:flex-row md:min-h-screen">
			<div className="p-7 border-b-2 md:border-r-2">
				<form onSubmit={handleSubmit} className="flex flex-col gap-8">
					<div className="flex items-center gap-2">
						<label className="whitespace-nowrap font-semibold">
							Search Term:
						</label>
						<input
							type="text"
							id="searchTerm"
							placeholder="Search..."
							className="border rounded-lg p-3 w-full"
							value={sideBarSearch.searchTerm}
							onChange={handleChange}
						/>
					</div>
					<div className="flex gap-2 flex-wrap items-center">
						<label className="font-semibold">Type:</label>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="all"
								className="w-5"
								onChange={handleChange}
								checked={sideBarSearch.type === "all"}
							/>
							<span>Rent & Sale</span>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="rent"
								className="w-5"
								onChange={handleChange}
								checked={sideBarSearch.type === "rent"}
							/>
							<span>Rent</span>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="sale"
								className="w-5"
								onChange={handleChange}
								checked={sideBarSearch.type === "sale"}
							/>
							<span>Sale</span>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="offer"
								className="w-5"
								onChange={handleChange}
								checked={sideBarSearch.offer}
							/>
							<span>Offer</span>
						</div>
					</div>
					<div className="flex gap-2 flex-wrap items-center">
						<label className="font-semibold">Amenities:</label>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="parking"
								className="w-5"
								onChange={handleChange}
								checked={sideBarSearch.parking}
							/>
							<span>Parking</span>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="furnished"
								className="w-5"
								onChange={handleChange}
								checked={sideBarSearch.furnished}
							/>
							<span>Furnished</span>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<label className="font-semibold">Sort:</label>
						<select
							id="sort_order"
							className="border rounded-lg p-3"
							onChange={handleChange}
							defaultValue={"created_At_desc"}
						>
							<option value="regularPrice_desc">
								Price low to high
							</option>
							<option value="regularPrice_asc">
								Price high to low
							</option>
							<option value="createdAt_desc">Latest</option>
							<option value="createdAt_asc">Oldest</option>
						</select>
					</div>
					<button className="bg-slate-700 text-white p-3 uppercase rounded-lg hover:opacity-95">
						Search
					</button>
				</form>
			</div>
			<div className="flex-1">
				<h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
					Listing result:
				</h1>
				<div className="p-7 flex flex-wrap gap-4">
					{!loading && listing.length === 0 && (
						<p className="text-xl text-slate-700">
							No listing found!!
						</p>
					)}
					{loading && (
						<p className="text-xl text-slate-700 text-center w-full">
							Loading...
						</p>
					)}
					{!loading &&
						listing &&
						listing.map((listing) => (
							<ListingItem key={listing._id} listing={listing} />
						))}
					{showMore && (
						<button
							onClick={() => {
								onShowMoreClick()
							}}
							className="text-green-700 hover:underline p-7 text-center w-full text-xl"
						>
							Show More
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
