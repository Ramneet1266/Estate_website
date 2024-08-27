import React, { useEffect, useState } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

export default function UpdateListing() {
	const [files, setFiles] = useState([])
	const [formData, setFromData] = useState({
		imageUrls: [],
		name: "",
		description: "",
		address: "",
		type: "rent",
		bedrooms: 1,
		bathrooms: 1,
		regularPrice: 50,
		discountPrice: 0,
		offer: false,
		parking: false,
		furnished: false
	})
	const [imageUploadError, setImageUploadError] = useState(false)
	const [uploading, setUploading] = useState(false)
	const [error, setError] = useState(false)
	//params is used to get the id inside the browser
	const params = useParams()
	const [loading, setLoading] = useState(false)
	const { currentUser } = useSelector(state => state.user)
	const navigate = useNavigate()

	useEffect(() => {
		//we cannot use async directly in the useEffect to use it we have to make one function inside the useEffect
		const fetchListing = async () => {
			//listingId after params must be same as the one written in the app.jsx file
			const listingId = params.listingId
			const res = await fetch(`/api/listing/get/${listingId}`)
			const data = await res.json()
			if (data.success === false) {
				console.log(data.message)
				return
			}
			setFromData(data)
		}
		fetchListing()
	}, [])

	const handleImageSubmit = e => {
		//formData.imageUrls.length this line is written to check the validation for the image length...if the images are uploaded more than 6 then error will be shown
		if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
			setUploading(true)
			setImageUploadError(false)
			//as we need to store more than one image in the array promise is used
			const promises = []

			for (let i = 0; i < files.length; i++) {
				promises.push(storeImage(files[i]))
			}
			//promise.all is used as we need to wait for every image to be successfully resolved
			Promise.all(promises)
				.then(urls => {
					// setFromData({ ...formData, imageUrls: urls })
					//we dont want to lost the prev images so for that below code is used this code will add previous images with the new ones
					setFromData({ ...formData, imageUrls: formData.imageUrls.concat(urls) })
					setImageUploadError(false)
					setUploading(false)
				})
				.catch(err => {
					setImageUploadError("Image upload failed (2 mb max per image")
					setUploading(false)
				})
		} else {
			setImageUploadError("You can only upload 6 images per listing")
			setUploading(false)
		}
	}
	const storeImage = async file => {
		return new Promise((resolve, reject) => {
			const storage = getStorage(app)
			const fileName = new Date().getTime() + file.name
			const storageRef = ref(storage, fileName)
			const uploadTask = uploadBytesResumable(storageRef, file)
			uploadTask.on(
				"state_changed",
				snapshot => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
					console.log(`Upload is ${progress}% done`)
				},
				error => {
					reject(error)
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
						resolve(downloadURL)
					})
				}
			)
		})
	}
	const handleRemoveImage = index => {
		setFromData({
			...formData,
			//in the below code we keep only those images whose index does not match with i
			imageUrls: formData.imageUrls.filter((_, i) => i !== index)
		})
	}

	const handleChange = e => {
		if (e.target.type === "number" || e.target.type === "text" || e.target.type === "textarea") {
			setFromData({
				...formData,
				//adding [] implies name: and not "name":
				[e.target.id]: e.target.value
			})
		}
		if (e.target.id === "sale" || e.target.id === "rent") {
			setFromData({
				...formData,
				type: e.target.id
			})
		}
		if (e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
			setFromData({
				...formData,
				[e.target.id]: e.target.checked
			})
		}
	}

	const handleSubmit = async e => {
		e.preventDefault()
		try {
			if (formData.imageUrls.length < 1) return setError("You must upload atleast one image")
			//+ is added to change the type of regular and discount price to only number as it changes sometimes to string or to number due to user event
			if (+formData.regularPrice < +formData.discountPrice) return setError("Discount price must be lower than regular price")
			setLoading(true)
			setError(false)
			//here params is required to fetch the data from the listingId
			const res = await fetch(`/api/listing/update/${params.listingId}`, {
				method: "POST",
				headers: {
					"Content-type": "application/json"
				},
				//it is imp to send userRef as we dont know which user is trying to create listing
				body: JSON.stringify({
					...formData,
					userRef: currentUser._id
				})
			})
			const data = await res.json()
			setLoading(false)
			if (data.success === false) {
				setError(data.message)
			}
			navigate(`/listing/${data._id}`)
		} catch (error) {
			setError(error.message)
			setLoading(false)
		}
	}

	return (
		<main className="p-3 max-w-4xl mx-auto">
			<h1 className="text-3xl font-semibold text-center my-7">Update a Listing</h1>
			<form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
				{/* flex-1 is given so that the 2 sub divs inside parent siv occupies the same space */}
				<div className="flex flex-col gap-4 flex-1">
					<input type="text" onChange={handleChange} value={formData.name} placeholder="Name" className="border p-3 rounded-lg" id="name" maxLength="62" minLength="5" required />
					<textarea onChange={handleChange} value={formData.description} type="text" placeholder="Description" className="border p-3 rounded-lg" id="description" required />
					<input onChange={handleChange} value={formData.address} type="text" placeholder="Address" className="border p-3 rounded-lg" id="address" required />
					<div className="flex gap-6 flex-wrap">
						<div className="flex gap-2">
							<input onChange={handleChange} checked={formData.type === "sale"} type="checkbox" id="sale" className="w-5" />
							<span>Sell</span>
						</div>
						<div className="flex gap-2">
							<input onChange={handleChange} checked={formData.type === "rent"} type="checkbox" id="rent" className="w-5" />
							<span>Rent</span>
						</div>
						<div className="flex gap-2">
							<input type="checkbox" id="parking" className="w-5" onChange={handleChange} checked={formData.parking} />
							<span>Parking Spot</span>
						</div>
						<div className="flex gap-2">
							<input type="checkbox" id="furnished" className="w-5" onChange={handleChange} checked={formData.furnished} />
							<span>Furnished</span>
						</div>
						<div className="flex gap-2">
							<input type="checkbox" onChange={handleChange} checked={formData.offer} id="offer" className="w-5" />
							<span>Offer</span>
						</div>
					</div>
					<div className="flex flex-wrap gap-6">
						<div className="flex items-center gap-2">
							<input
								type="number"
								id="bedrooms"
								min="1"
								max="10"
								required
								onChange={handleChange}
								value={formData.bedrooms}
								className="p-3 border border-gray-300 rounded-lg
                            "
							/>
							<p>Beds</p>
						</div>
						<div className="flex items-center gap-2">
							<input
								type="number"
								id="bathrooms"
								min="1"
								max="10"
								onChange={handleChange}
								value={formData.bathrooms}
								required
								className="p-3 border border-gray-300 rounded-lg
                            "
							/>
							<p>Baths</p>
						</div>
						<div className="flex items-center gap-2">
							<input
								type="number"
								id="regularPrice"
								onChange={handleChange}
								value={formData.regularPrice}
								min="50"
								max="10000"
								required
								className="p-3 border border-gray-300 rounded-lg
                            "
							/>
							<div className="flex flex-col items-center">
								<p>Regular price</p>
								<span className="text-xs">($ / month)</span>
							</div>
						</div>
						{formData.offer && (
							<div className="flex items-center gap-2">
								<input
									type="number"
									id="discountPrice"
									min="0"
									max="10000"
									onChange={handleChange}
									value={formData.discountPrice}
									required
									className="p-3 border border-gray-300 rounded-lg
                            "
								/>
								<div className="flex flex-col items-center">
									<p>Discounted price</p>
									<span className="text-xs">($ / month)</span>
								</div>
							</div>
						)}
					</div>
				</div>
				<div className="flex flex-col flex-1 gap-4">
					<p className="font-semibold">
						Images:
						<span className="font-normal text-gray-600 ml-2">The first image will be the cover (max-6)</span>
					</p>
					<div className="flex gap-4">
						<input onChange={e => setFiles(e.target.files)} className="p-3 border border-gray-300 rounded w-full" type="file" id="images" accept="image/*" multiple />
						{/*to unable this button to not submit the whole form we need to change its type to button as its only functionality is to upload images */}
						<button type="button" disabled={uploading} onClick={handleImageSubmit} className="p-3 text-green-700 border  border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
							{uploading ? "Uploading..." : "upload"}
						</button>
					</div>
					<p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
					{formData.imageUrls.length > 0 &&
						formData.imageUrls.map((url, index) => (
							<div key={url} className="flex justify-between p-3 border items-center">
								<img src={url} alt="lisitng image" className="w-20 h-20 object-contain rounded-lg" />
								{/* we added a callback as if we don't this function is called automatically without clicking */}
								<button type="button" onClick={() => handleRemoveImage(index)} className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75">
									Delete
								</button>
							</div>
						))}
					<button disabled={loading || uploading} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
						{loading ? "Creating..." : "Update Listing"}
					</button>
					{error && <p className="text-red-700 text-sm">{error}</p>}
				</div>
			</form>
		</main>
	)
}