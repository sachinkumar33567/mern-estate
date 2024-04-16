import { useEffect, useState } from "react"
import {useNavigate} from 'react-router-dom'
import Card from "../components/Card"

export default function Search() {
    const navigate = useNavigate()
    const [listings, setListings] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [showMore, setShowMore] = useState(false)
    const [formData, setFromData] = useState({
        searchTerm: '',
        type: 'all',
        furnished: false,
        parking: false,
        offer: false,
        sort: 'created_at',
        order: 'desc'
    })

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromURL = urlParams.get('searchTerm')
        const typeFromURL = urlParams.get('type')
        const furnishedFromURL = urlParams.get('furnished')
        const parkingFromURL = urlParams.get('parking')
        const offerFromURL = urlParams.get('offer')
        const sortFromURL = urlParams.get('sort')
        const orderFromURL = urlParams.get('order')

        setFromData({
            searchTerm: searchTermFromURL,
            type: typeFromURL || 'all',
            furnished: furnishedFromURL === 'true' ? true : false,
            parking: parkingFromURL === 'true' ? true : false,
            offer: offerFromURL === 'true' ? true : false,
            sort: sortFromURL || 'created_at',
            order: orderFromURL || 'desc'
        })

        const fetchListings = async () => {
            setLoading(true)
            setShowMore(false)
            const searchQuery = urlParams.toString()
            try {
                const res = await fetch(`api/listing/get?${searchQuery}`)
                const data = await res.json()
                if (data.success === false) {
                    setError(true)
                    setLoading(false)
                    return
                }
                if (data.length === 9) {
                    setShowMore(true)
                } else {
                    setShowMore(false)
                }
                setListings(data)
                setLoading(false)
                setError(false)
                
            } catch (error) {
                console.log(error.message)
                setError(true)
                setLoading(false)
            }
        }

        fetchListings()

    }, [location.search])

    const handleChange = event => {
        const {id, value, checked} = event.target

        if (id === 'searchTerm') {
            setFromData({...formData, [id]: value})
        }

        if (id === 'all' || id === 'rent'  || id === 'sale') {
            setFromData({...formData, type: id})
        }

        if (id === 'furnished' || id === 'parking' || id === 'offer') {
            setFromData({...formData, [id]: checked || checked === 'true'? true : false})
        }

        if (id === 'sort_order') {
            const sort = value.split('_')[0] || 'created_at'
            const order = value.split('_')[1] || 'desc'

            setFromData({...formData, sort, order})
        }
    }

    const handleSubmit = event => {
        event.preventDefault()

        const urlParams = new URLSearchParams()
        urlParams.set('searchTerm', formData.searchTerm)
        urlParams.set('type', formData.type)
        urlParams.set('furnished', formData.furnished)
        urlParams.set('parking', formData.parking)
        urlParams.set('offer', formData.offer)
        urlParams.set('sort', formData.sort)
        urlParams.set('order', formData.order)
        const searchQuery = urlParams.toString()

        navigate(`/search?${searchQuery}`)
    }

    const handleShowMore = async () => {
        const urlParams = new URLSearchParams(location.search)
        const numberOfListings = listings.length
        const startIndex = numberOfListings
        urlParams.set('startIndex', startIndex)
        const searchQuery = urlParams.toString()

        try {
            const res = await fetch(`api/listing/get?${searchQuery}`)
            const data = await res.json()
            if (data.success === false) {
                console.log(data.message)
                return
            }
            if (data.length < 9) {
                setShowMore(false)
            }
            setListings([...listings, ...data])
        } catch (error) {
            console.log(error.message)
        }
    }

    return <div className="flex flex-col md:flex-row">
        <div className="p-7 border-b-2 md:border-r-2 md:shadow-xl md:min-h-screen">
            <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                <div className="flex gap-2 items-center ">
                    <label className="whitespace-nowrap text-slate-700 font-semibold">Search Term:</label>
                    <input
                    type="text"
                    id="searchTerm"
                    placeholder="Search..."
                    className="border p-2 sm:p-3 w-full rounded-lg"
                    value={formData.searchTerm}
                    onChange={handleChange} />
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <label className="text-slate-700 font-semibold">Type:</label>
                    <div className="flex gap-2">
                        <input id="all" type="checkbox" className="w-4 sm:w-5"
                        checked={formData.type === 'all'}
                        onChange={handleChange} />
                        <span>Rent & Sale</span>
                    </div>
                    <div className="flex gap-2">
                        <input id="rent" type="checkbox" className="w-4 sm:w-5"
                        checked={formData.type === 'rent'}
                        onChange={handleChange} />
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input id="sale" type="checkbox" className="w-4 sm:w-5"
                        checked={formData.type === 'sale'}
                        onChange={handleChange} />
                        <span>Sale</span>
                    </div>
                    <div className="flex gap-2">
                        <input id="offer" type="checkbox" className="w-4 sm:w-5"
                        checked={formData.offer}
                        onChange={handleChange} />
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <label className="text-slate-700 font-semibold">Amenities:</label>
                    <div className="flex gap-2">
                        <input id="furnished" type="checkbox" className="w-4 sm:w-5"
                        checked={formData.furnished}
                        onChange={handleChange} />
                        <span>Furnished</span>
                    </div>
                    <div className="flex gap-2">
                        <input id="parking" type="checkbox" className="w-4 sm:w-5"
                        checked={formData.parking}
                        onChange={handleChange} />
                        <span>Parking</span>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <label className="text-slate-700 font-semibold">Sort:</label>
                    <select id="sort_order" className="boder p-2 sm:p-3 rounded-lg"
                    defaultValue={'createdAt_desc'}
                    onChange={handleChange} >
                        <option value={'regularPrice_desc'}>Price low to high</option>
                        <option value={'regularPrice_asc'}>Price high to low</option>
                        <option value={'createdAt_desc'}>Latest</option>
                        <option value={'createdAt_asc'}>Oldest</option>
                    </select>
                </div>
                <button
                type="submit"
                className="bg-slate-700 text-white p-2 sm:p-3 text-center rounded-lg
                uppercase hover:opacity-95"
                >Search</button>
            </form>
        </div>
        <div className="w-full">
            <h1 className="text-xl sm:text-3xl text-slate-700 font-semibold p-3 sm:mt-5 border-b-2">
                Listing results:
            </h1>
            <div className="flex flex-wrap gap-6 p-3 mt-5 w-full">
                {!loading && listings.length === 0 &&
                <p className="text-xl sm:text-2xl text-slate-700 w-full text-center">
                    No listings found!
                </p>}
                {loading &&
                <p className="text-xl sm:text-2xl text-slate-700 w-full text-center" >
                    Loading...
                </p>}
                {!loading && !error && listings.length > 0 && listings.map(
                    listing => <Card key={listing._id} listing={listing}/>
                )}
            </div>
            {showMore && <button
            className="text-green-700 w-full text-center hover:underline mt-4 sm:text-xl"
            onClick={handleShowMore}
            >
                Show more
            </button>}
        </div>
    </div>
}
