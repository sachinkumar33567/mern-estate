import { Link } from "react-router-dom"
import { FaMapMarkerAlt } from "react-icons/fa"

export default function Card({listing}) {
    return <div className="bg-white shadow-md hover:shadow-lg
            transition-shadow overflow-hidden rounded-lg
            w-full sm:w-[330px]">
        <Link to={`/listing/${listing._id}`}>
            <img src={listing.images[0]}
            alt="listing cover"
            className="h-[220px] w-full object-cover
            hover:scale-105 transition-scale duration-300" />
            <div className="p-3 flex flex-col gap-2 w-full">
                <p className="text-lg text-slate-700 font-semibold truncate">
                    {listing.name}
                </p>
                <div className="flex gap-1 items-center">
                    <FaMapMarkerAlt className="text-lg text-green-700"/>
                    <p className="text-sm text-gray-600 truncate">{listing.address}</p>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>
                <p className="text-slate-500 font-semibold mt-2">
                    ${listing.offer ?
                    listing.discountPrice.toLocaleString('en-US') :
                    listing.regularPrice.toLocaleString('en-US') }
                    {listing.type ==='rent' && '/month'}
                </p>
                <div className="flex gap-3 text-xs sm:text-sm text-slate-600 font-bold">
                    <span>{listing.bedrooms} {listing.bedrooms > 1? 'Beds' : 'Bed'}</span>
                    <span>{listing.bathrooms} {listing.bathrooms > 1? 'Baths' : 'Bath'}</span>
                </div>
            </div>
        </Link>
    </div>
}
