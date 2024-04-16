import { useEffect, useRef, useState } from "react"
import {useDispatch, useSelector} from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import {useNavigate} from 'react-router-dom'
import {
  deleteUserFailure, deleteUserStart, deleteUserSuccess,
  signOutFailure,
  signOutStart,
  signOutSuccess,
  updateUserFailure, updateUserStart, updateUserSuccess
} from "../redux/user/userSlice"

export default function Profile() {
  const [formData, setFormData] = useState({})
  const [file, setFile] = useState(undefined)
  const [imgUploadPerc, setImgUploadPerc] = useState(null)
  const [imgUploadError, setImgUploadError] = useState(false)
  const [userUpdated, setUserUpdated] = useState(false)
  const {currentUser, loading, error} = useSelector(state => state.user)
  const [showListingsError, setShowListingsError] = useState(null)
  const [listings, setListings] = useState([])
  const [showListings, setShowListings] = useState(false)
  const [listingLoading, setListingLoading] = useState(false)

  const fileRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgUploadPerc(Math.round(progress))
      },
      error => {
        setImgUploadError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
        .then(downloadURL => {
          setFormData({...formData, profilePicture: downloadURL})
        })
      }
    );
  }

  const handleChange = (event) => {
    const {id, value} = event.target
    setFormData({...formData, [id]: value})
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    dispatch(updateUserStart())
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      })
      
      const data = await res.json()

      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      }

      dispatch(updateUserSuccess(data))
      setUserUpdated(true)
      
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'delete'
      })

      const data = await res.json()
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
      }

      dispatch(deleteUserSuccess(data))

    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart())
      const res = await fetch('/api/auth/signout')
      const data = await res.json()
      
      if (data.success === false) {
        dispatch(signOutFailure(data.message))
        return
      }

      dispatch(signOutSuccess(data))

    } catch (error) {
      dispatch(signOutFailure(error.message))
    }
  }

  const handleShowListings = async () => {
    setShowListings(true)
    setShowListingsError(null)
    try {
      setListingLoading(true)
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json()

      if (data.success === false) {
        setShowListingsError(data.message)
        setListingLoading(false)
        return
      }
      setListings(data)
      setListingLoading(false)
    } catch (error) {
      setShowListingsError(error.message)
      setListingLoading(false)
    }
  }

  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'delete'
      })
      const data = await res.json()

      if (data.success === false) {
        return console.log(data.message)
      }

      setListings(listings.filter(listing => listing._id !== listingId))
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center my-7">
        Profile
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={event => setFile(event.target.files[0])}
        />
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt="profile"
          className="h-24 w-24 rounded-full object-cover self-center"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-sm text-center">
          {
            imgUploadError ?
            <span className="text-red-700">
              Error image upload
            </span> :
            imgUploadPerc > 0 && imgUploadPerc < 100 ?
            <span className="text-slate-700">
              {`Uploading ${imgUploadPerc}%`}
            </span> :
            imgUploadPerc === 100 ?
            <span className="text-green-700">
              Image successfully uploaded
            </span> : ''
          }
        </p>
        <input
          type="text"
          id="username"
          defaultValue={currentUser.username}
          placeholder="Username"
          className="border p-3"
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          defaultValue={currentUser.email}
          placeholder="name@company.in"
          className="border p-3"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="New Password"
          className="border p-3"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-md
          hover:opacity-95 disabled:opacity-80 uppercase"
          disabled={loading}
        >
          {loading? 'Loading...': 'Update'}
        </button>
        <a
          href="/create-listing"
          className="bg-green-700 text-white p-3 rounded-md
          hover:opacity-95 uppercase text-center"        
        >
          Create listing
        </a>
      </form>
      <div className="mt-4 flex justify-between text-red-600">
        <button type="button" onClick={handleDelete}>Delete Account</button>
        <button type="button" onClick={handleSignOut}>Sign Out</button>
      </div>
      {error && <p className="text-red-600 mt-5">{error}</p>}
      {userUpdated && <p className="text-green-700 mt-5">User updated successfully</p>}
      <button type="button"
      className="text-green-700 w-full"
      onClick={handleShowListings}
      hidden={showListings}
      >
        Show Listings
      </button>
      {showListingsError && <p className="text-red-600">{showListingsError}</p>}
      {showListings && (listings.length > 0 ?
      <p className="text-2xl text-slate-700 font-semibold text-center py-5">Your Listings</p> :
      (listingLoading ? <p className="text-center">Loading...</p> :
      <p className="text-center">No listings found</p>))}
      {listings.length > 0 && listings.map(listing => (
        <div
        key={listing._id}
        className="border rounded-lg p-3 my-2 flex gap-4 justify-between items-center"
        >
          <a href={`/listing/${listing._id}`}>
            <img src={listing.images[0]} alt="liting image"
            className="h-16 w-16 object-contain"
            />
          </a>
          <a href={`/listing/${listing._id}`}
          className="text-slate-700 font-semibold hover:underline flex-1 truncate">
            <p>
              {listing.name}
            </p>
          </a>
          <div className="flex gap-6">
            <button
            type="button"
            className="text-green-700 uppercase"
            onClick={() => navigate(`/update-listing/${listing._id}`)}
            >
              Edit
            </button>
            <button
            type="button"
            className="text-red-700 uppercase"
            onClick={() => handleDeleteListing(listing._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}