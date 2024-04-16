import { useState } from "react"
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

export default function CreateListing() {
    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'rent',
        images: [],
        address: '',
        regularPrice: 100,
        discountPrice: 0,
        bedrooms: 1,
        bathrooms: 1,
        furnished: false,
        parking: false,
        offer: false
    })
    const [imageUploadError, setImageUploadError] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const {currentUser} = useSelector(state => state.user)
    const navigate = useNavigate()

    const handleImageUpload = () => {
        setImageUploadError(null)
        if (files.length > 0 && files.length + formData.images.length < 7) {
            setUploading(true)
            const promises = []
            for (let i=0; i<files.length; i++) {
                promises.push(storeImage(files[i]))
            }
            Promise.all(promises).then(urls => {
                setFormData({...formData, images: formData.images.concat(urls)})
                setImageUploadError(null)
                setUploading(false)
            }).catch(error => {
                setImageUploadError('Image upload failed (10MB max per image)')
                setUploading(false)
            })
        } else {
            setImageUploadError('You can only upload 6 images per listing')
            setUploading(false)
        }
    }

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)

            uploadTask.on(
                'state_changed',
                snapshot => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`${Math.round(progress)}% done`)
                  },
                error => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                    .then(downloadURL => {
                        resolve(downloadURL)
                    })
                }
            )
        })
    }

    const handleChange = (event) => {
        const {type, id, value, checked} = event.target

        if (id === 'sale' || id === 'rent') {
            setFormData({
                ...formData,
                type: id
            })
        }

        if (id === 'furnished' || id === 'parking' || id === 'offer') {
            setFormData({
                ...formData,
                [id]: checked
            })
        }

        if (type === 'text' || type === 'textarea' || type === 'number') {
            setFormData({
                ...formData,
                [id]: type === 'number'? Number(value) : value
            })
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const {images, regularPrice, discountPrice} = formData
        if (images.length < 1) {
            return setError('You must upload at least one image!')
        }
        if (discountPrice > regularPrice) {
            return setError('Discount price must be less than or equal to regular price!')
        }
        try {
            setLoading(true)
            const res = await fetch('/api/listing/create', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
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
            setLoading(false)
            setError(error.message)
        }
    }

    return (
    <div className="p-3 max-w-4xl mx-auto">
        <h1 className="text-3xl text-slate-600 font-bold text-center mt-5">Create a Listing</h1>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6 mt-10">
            <div className="flex flex-col gap-4 flex-1">
                <input
                    type="text"
                    id="name"
                    placeholder="Name"
                    className="border p-3 rounded-lg"
                    required
                    onChange={handleChange}
                    value={formData.name}
                />
                <textarea
                    type="textarea"
                    id="description"
                    placeholder="Description"
                    className="border p-3 rounded-lg"
                    required
                    onChange={handleChange}
                    value={formData.description}
                />
                <input
                    type="text"
                    id="address"
                    placeholder="Address"
                    className="border p-3 rounded-lg"
                    required
                    onChange={handleChange}
                    value={formData.address}
                />
                <div className="flex flex-wrap gap-4">
                    <div className="flex gap-2">
                        <input type="checkbox" id="sale" className="w-5"
                        onChange={handleChange}
                        checked={formData.type === 'sale'}
                        />
                        <span>Sale</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="rent" className="w-5"
                        onChange={handleChange}
                        checked={formData.type === 'rent'}
                        />
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="furnished" className="w-5"
                        onChange={handleChange}
                        checked={formData.furnished}
                        />
                        <span>Furnished</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="parking" className="w-5"
                        onChange={handleChange}
                        checked={formData.parking}
                        />
                        <span>Parking spot</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="offer" className="w-5"
                        onChange={handleChange}
                        checked={formData.offer}
                        />
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4">
                    <div className="flex gap-2 items-center">
                        <input type="number" id="bedrooms" min="1" max="10"
                        className="border border-gray-400 p-2 rounded-lg w-16"
                        onChange={handleChange}
                        value={formData.bedrooms}
                        />
                        <span>Beds</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <input type="number" id="bathrooms" min="1" max="10"
                        className="border border-gray-400 p-2 rounded-lg w-16"
                        onChange={handleChange}
                        value={formData.bathrooms}
                        />
                        <span>Baths</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <input type="number" id="regularPrice"
                        className="border border-gray-400 p-2 rounded-lg w-32"
                        min="100"
                        max="1000000"
                        onChange={handleChange}
                        value={formData.regularPrice}
                        />
                        <div>
                            <p>Regular Price</p>
                            {formData.type === 'rent' && <span className="text-xs">($ / month)</span>}
                        </div>
                    </div>
                    {formData.offer && (
                    <div className="flex gap-2 items-center">
                        <input type="number" id="discountPrice"
                        className="border border-gray-400 p-2 rounded-lg w-32"
                        min="0"
                        max="1000000"
                        onChange={handleChange}
                        value={formData.discountPrice}
                        />
                        <div>
                            <p>Discount Price</p>
                            {formData.type === 'rent' && <span className="text-xs">($ / month)</span>}
                            
                        </div>
                    </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-4 flex-1">
                <p className="font-semibold">Images:
                    <span className="text-normal text-gray-600 ml-2">
                        The first image will be the cover (max 6)
                    </span>
                </p>
                <div className="flex gap-4">
                    <input type="file" id="images" accept="image/*" multiple
                    onChange={e => setFiles(e.target.files)}
                    className="p-3 border border-gray-300 rounded w-full"/>
                    <button
                        type="button"
                        className="p-3 border border-green-700 text-green-700 rounded
                        uppercase hover:shadow-lg disabled:opacity-80"
                        onClick={handleImageUpload}
                        disabled={uploading}
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
                {imageUploadError && <p className="text-red-700 text-sm">{imageUploadError}</p>}
                {formData.images.length > 0 && formData.images.map((image, index) => (
                    <div key={index} className="flex justify-between">
                        <img src={image} alt="listing image"
                        className="h-20 w-20 object-contain rounded-md"
                        />
                        <button type="button" className="p-3 text-red-700 hover:opacity-80"
                        onClick={() => {
                            setFormData({
                                ...formData,
                                images: formData.images.filter((_, i) => i !== index)
                            })
                        }}>
                            DELETE
                        </button>
                    </div>
                ))}
                <button type="submit"
                className="p-3 bg-slate-700 text-white rounded-lg uppercase mt-4
                hover:opacity-95 disabled:opacity-80"
                disabled={loading || uploading}
                >
                    {loading ? 'Creating...' : 'Create Listing'}
                </button>
                {error && <p className="text-red-700 text-sm">{error}</p>}
            </div>
        </form>
    </div>
    )
}
