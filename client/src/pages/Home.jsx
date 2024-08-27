import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css/bundle"
import SwiperCore from "swiper"
import { Navigation } from "swiper/modules"
import ListingItem from "../components/ListingItem"

export default function Home() {
	const [offerListing, setOfferListing] = useState([])
	const [saleListing, setSaleListing] = useState([])
	const [rentListing, setRentListing] = useState([])
	SwiperCore.use([Navigation])
	console.log(offerListing)

	useEffect(() => {
		const fetchOfferListings = async () => {
			try {
				const res = await fetch("/api/listing/get?offer=true&limit=4")
				const data = await res.json()
				setOfferListing(data)
				//until the offer Listing is not fetched and displayed rent listing will not run
				fetchRentListings()
			} catch (error) {
				console.log(error)
			}
		}
		const fetchRentListings = async () => {
			try {
				const res = await fetch("/api/listing/get?type=rent&limit=4")
				const data = await res.json()
				setRentListing(data)
				//until the offer Listing is not fetched and displayed sale listing will not run
				fetchSaleListings()
			} catch (error) {
				console.log(error)
			}
		}
		const fetchSaleListings = async () => {
			try {
				const res = await fetch("/api/listing/get?type=sale&limit=4")
				const data = await res.json()
				setSaleListing(data)
			} catch (error) {
				console.log(error)
			}
		}
		fetchOfferListings()
	}, [])
	return (
		<div>
			{/* Top */}
			<div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
				<h1 className="text-slate-700 font-bold tex-3xl lg:text-6xl">
					Find your next{" "}
					<span className="text-slate-500">perfect</span>
					<br /> place with ease
				</h1>
				<div className="text-gray-400 test-xs sm:text-sm">
					Shah Estate is the best place to find your next perfect
					place to live.
					<br />
					We have a wide range of properties for you to choose from.
				</div>
				<Link
					className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
					to="/search"
				>
					Let's get started...
				</Link>
			</div>
			{/* Swiper */}
			<Swiper navigation>
				{offerListing &&
					offerListing.length > 0 &&
					offerListing.map((listing) => (
						<SwiperSlide>
							<div
								className="h-[500px]"
								key={listing._id}
								style={{
									background: `url(${listing.imageUrls[0]}) center no-repeat`,
									backgroundSize: "cover",
								}}
							></div>
						</SwiperSlide>
					))}
			</Swiper>
			{/* Listing results for offer, sale and rent */}
			<div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
				{offerListing && offerListing.length > 0 && (
					<div className="">
						<div className="my-3">
							<h2 className="text-2xl font-semibold text-slate-600">
								Recent offers
							</h2>
							<Link
								className="text-sm text-blue-800 hover:underline"
								to={"/search?offer=true"}
							>
								Show more offers.
							</Link>
						</div>
						<div className="flex flex-wrap gap-4">
							{offerListing.map((listing) => (
								<ListingItem listing={listing} key={listing._id} />
							))}
						</div>
					</div>
				)}
				{rentListing && rentListing.length > 0 && (
					<div className="">
						<div className="my-3">
							<h2 className="text-2xl font-semibold text-slate-600">
								Recent places for rent
							</h2>
							<Link
								className="text-sm text-blue-800 hover:underline"
								to={"/search?type=rent"}
							>
								Show more places for rent.
							</Link>
						</div>
						<div className="flex flex-wrap gap-4">
							{rentListing.map((listing) => (
								<ListingItem listing={listing} key={listing._id} />
							))}
						</div>
					</div>
				)}
				{saleListing && saleListing.length > 0 && (
					<div className="">
						<div className="my-3">
							<h2 className="text-2xl font-semibold text-slate-600">
								Recent places for sale
							</h2>
							<Link
								className="text-sm text-blue-800 hover:underline"
								to={"/search?type=sale"}
							>
								Show more places for sale.
							</Link>
						</div>
						<div className="flex flex-wrap gap-4">
							{saleListing.map((listing) => (
								<ListingItem listing={listing} key={listing._id} />
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
