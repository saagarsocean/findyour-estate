import { Link } from "react-router-dom";
import { MdLocationOn } from 'react-icons/md'
import { FaBed, FaBath } from "react-icons/fa";

export default function ListingItem({listing}) {
    return (
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px] mt-5 h-[450px] ">
            <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt="Listing Cover" 
                    className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
                />
                <div className="p-3 flex flex-col gap-2">
                    <p className="truncate text-lg font-semibold text-slate-700">
                        {listing.name}
                    </p>
                    <div className="flex items-center gap-1 w-full">
                        <MdLocationOn className="h-4 w-4 text-green-700 flex-shrink-0"/>
                        <p className="text-sm text-gray-600 truncate">
                            {listing.address}
                        </p>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {listing.description}
                    </p>
                    <p className="text-slate-500 mt-2 font-semibold">
                        ₹
                        {listing.offer ? listing.discountPrice.toLocaleString('en-IN') : listing.regularPrice.toLocaleString('en-IN')}
                        {listing.type === 'rent' && ' / Month'}
                    </p>
                    <div className="text-slate-700 flex gap-4">
                        <div className=" flex items-center gap-1 font-bold text-xs">
                            <FaBed className="h-4 w-4 text-slate-700 flex-shrink-0"/>
                            {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                        </div>
                        <div className=" flex items-center gap-1 font-bold text-xs">
                            <FaBath className="h-4 w-4 text-slate-700 flex-shrink-0"/>
                            {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}