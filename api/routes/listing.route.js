import express from "express"
import {
	createListing,
	deleteListing,
	getListing,
	getListings,
	updateListing,
} from "../controllers/listing.controller.js"
import { verifyToken } from "../utils/verifyUser.js"

const router = express.Router()

router.post("/create", verifyToken, createListing)
router.delete("/delete/:id", verifyToken, deleteListing)
router.post("/update/:id", verifyToken, updateListing)
//we dont need verifyToken in the below route as the information we get from the database is to be seen by the public info like name, image, desc etc
router.get("/get/:id", getListing)
router.get("/get", getListings)

export default router
