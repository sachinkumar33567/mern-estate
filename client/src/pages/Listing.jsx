import { useEffect, useState } from "react"
import {useSelector} from 'react-redux'
import { useParams} from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle'
import { FaBed, FaBath, FaMapMarkerAlt, FaParking, FaChair } from "react-icons/fa"
import Contact from "../components/Contact"

export default function Listing() {
    SwiperCore.use([Navigation])
    const [listing, setListing] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [contact, setContact] = useState(false)
    const {currentUser} = useSelector(state => state.user)
    const params = useParams()

    useEffect(() => {
        const fetchListing = async (id) => {
            try {
                setLoading(true)
                const res = await fetch(`/api/listing/get/${id}`)
                const data = await res.json()
                if (data.success === false) {
                    setError(true)
                    setLoading(false)
                    return
                }
                setListing(data)
                setError(false)
            } catch (error) {
                setError(true)
            }
            setLoading(false)
        }

        fetchListing(params.id)
    }, [params.id])

    return (
        <main className="p-2">
            {loading && <p className="text-xl sm:text-2xl mt-7 text-center">Loading...</p>}
            {error && <p className="text-2xl mt-7 text-center">Something went wrong!</p>}
            {listing && !loading && !error &&
            <>
                <Swiper navigation>
                    {listing.images && listing.images.map(url => <SwiperSlide key={url}>
                        <div
                        className="h-[260px] md:h-[400px] lg:h-[600px]"
                        style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover'}}
                        >

                        </div>
                    </SwiperSlide>)}
                </Swiper>
                <div className="w-full max-w-4xl mx-auto">
                    <p className="text-2xl font-semibold my-7">
                        {listing.name} - ${listing.regularPrice}
                        {listing.type === 'rent' && ' / month'}
                    </p>
                    <p className="flex gap-2 items-center text-slate-600 font-semibold">
                        <FaMapMarkerAlt className="text-2xl text-green-700"/>
                        {listing.address}
                    </p>
                    <div className="flex gap-4 my-4">
                        <p
                        className="bg-red-900 text-white w-full max-w-[200px] text-center p-2 rounded-md"
                        >
                            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                        </p>
                        {listing.offer && 
                        <p
                        className="bg-green-900 text-white w-full max-w-[200px] text-center p-2 rounded-md"
                        >
                            ${listing.discountPrice} offer
                        </p>}
                    </div>
                    <p className="text-slate-800"><span className="font-semibold">Description</span> - {listing.description}</p>
                    <ul className="flex gap-4 sm:gap-6 items-center text-sm text-green-900 font-semibold my-4">
                        <li className="flex gap-2 items-center whitespace-nowrap">
                            <FaBed className="text-lg"/>
                            {listing.bedrooms}
                            {listing.bedrooms > 1 ? ' beds' : ' bed'}
                        </li>
                        <li className="flex gap-2 items-center whitespace-nowrap">
                            <FaBath className="text-lg"/>
                            {listing.bathrooms}
                            {listing.bathrooms > 1 ? ' baths' : ' bath'}
                        </li>
                        <li className="flex gap-2 items-center whitespace-nowrap">
                            <FaParking className="text-lg"/>
                            {listing.parking ? 'Parking' : 'No parking'}
                        </li>
                        <li className="flex gap-2 items-center whitespace-nowrap">
                            <FaChair className="text-lg"/>
                            {listing.furnished ? 'Furnished' : 'Not furnished'}
                        </li>
                    </ul>
                    {currentUser && currentUser._id !== listing.userRef &&
                    <button
                    className="p-2 sm:p-3 bg-slate-700 text-white text-lg sm:text-xl
                    uppercase rounded-md w-full mt-5"
                    onClick={() => setContact(true)}
                    hidden={contact}
                    >
                        Contact to Landlord
                    </button>
                    }
                    {contact && <Contact listing={listing}/>}
                </div>
            </>}
        </main>
    )
}
