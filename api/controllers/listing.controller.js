import Listing from "../models/listing.model.js"
import { errorHandler } from "../utils/error.js"

export const createListing = async (req, res, next) => {
	try {
		const listing = await Listing.create(req.body)
		return res.status(201).json(listing)
	} catch (error) {
		next(error)
	}
}

export const deleteListing = async (req, res, next) => {
	const listing = await Listing.findById(req.params.id)
	if (!listing) {
		return next(errorHandler(404, "Listing is not found!!"))
	}
	if (req.user.id !== listing.userRef) {
		return next(
			errorHandler(401, "You can only delet your own listings!!")
		)
	}
	try {
		await Listing.findByIdAndDelete(req.params.id)
		res.status(200).json("Listing has been deleted!!")
	} catch (error) {
		next(error)
	}
}

export const updateListing = async (req, res, next) => {
	const listing = await Listing.findById(req.params.id)
	if (!listing) {
		return next(errorHandler(404, "Listing not found!"))
	}
	if (req.user.id !== listing.userRef) {
		return next(
			errorHandler(401, "You can only update your own listing!")
		)
	}
	try {
		const updatedListing = await Listing.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		)
		res.status(200).json(updatedListing)
	} catch (error) {
		next(error)
	}
}

export const getListing = async (req, res, next) => {
	try {
		const listing = await Listing.findById(req.params.id)
		if (!listing)
			return next(errorHandler(404, "Listing not found!!"))

		res.status(200).json(listing)
	} catch (error) {
		next(error)
	}
}

export const getListings = async (req, res, next) => {
	const limit = parseInt(req.query.limit) || 9
	const startIndex = parseInt(req.query.startIndex) || 0
	let offer = req.query.offer

	//here if the offer is false or undefined(user has not selected the checkbox which contain the value of offer) then the values with both true and false properties are shown
	if (offer === "false" || offer === undefined) {
		offer = { $in: [false, true] }
	}

	let furnished = req.query.furnished
	if (furnished === "false" || furnished === undefined) {
		furnished = { $in: [false, true] }
	}

	let parking = req.query.parking
	if (parking === "false" || parking === undefined) {
		parking = { $in: [false, true] }
	}

	let type = req.query.type
	if (type === "all" || type === undefined) {
		type = { $in: ["sale", "rent"] }
	}
	const searchTerm = req.query.searchTerm || ""

	//createdAt is the time at which listing is created
	const sort = req.query.sort || "createdAt"

	const order = req.query.order || "desc"

	const listing = await Listing.find({
		//here $regex is used to match the patterns entered by the user with the names written in mongodb. For example name of house is Ramneet villa and user entered alphabets like nee or entered whole word like villa $regex will search for these patterns in name of the house ($regex is a functionality of mongodb)
		//$options: 'i' here refers to search without caring about the uppercase of lowercase letters user can search for Ramneet and ramneet both and the result will be the same
		name: { $regex: searchTerm, $options: "i" },
		offer,
		furnished,
		parking,
		type,
	})
		.sort({ [sort]: order })
		.limit(limit)
		.skip(startIndex)

	return res.status(200).json(listing)
}
