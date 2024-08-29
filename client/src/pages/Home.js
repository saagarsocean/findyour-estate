import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { Link } from "react-router-dom";
import axios from "../config/axios";
//import { Swiper, SwiperSlide } from "swiper/react";
import ListingItem from "../components/ListingItem";

export default function Home() {
    const [offerListings, setOfferListings] = useState([])
    const [saleListings, setSaleListings] = useState([])
    const [rentListings, setRentListings] = useState([])
    const { currentUser } = useSelector((state) => state.user)
    

    useEffect(() => {
        const fetchOfferListings = async() => {
            try{
                const res = await axios.get(`/listing/get?offer=true&limit=3`)
                const data = res.data
                setOfferListings(data)
                fetchRentListings()
            } catch(error) {
                console.log(error)
            }
        }
        const fetchRentListings = async() => {
            try{
                const res = await axios.get(`/listing/get?type=rent&limit=3`)
                const data = res.data
                setRentListings(data)
                fetchSaleListings()
            } catch(error) {
                console.log(error);
            } 
        }

        const fetchSaleListings = async() => {
            try{
                const res = await axios.get(`/listing/get?type=sale&limit=3`)
                const data = res.data
                setSaleListings(data)
            } catch(error) {
                console.log(error);
            }
        }

        fetchOfferListings()
    }, [])

    return (
        <div>
            {/* top */}
            <div className="flex flex-col gap-6 p-10 px-3 max-w-6xl mx-auto">
                
                <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
                    Find your next <span className="text-slate-500">perfect</span> 
                    <br />
                    place with ease
                </h1>
                {currentUser?.isAdmin ? (
                    <>
                        <h2 className="text-xl font-bold text-slate-700 mt-4">Welcome Admin...</h2>
                        <Link to="/admin/unverified" className="text-xs sm:text-sm text-blue-800 font-bold hover:underline">
                            View Unverified Lists now...
                        </Link>
                    </>
                ) : (
                    <Link to={'/search'} className="text-xs sm:text-sm text-blue-800 font-bold hover:underline mt-10">
                        FIND YOUR ESTATE now...
                    </Link>
                )}
            </div>

            {/* swiper */}

            {/* <Swiper className="mr-20 ml-20" navigation>
                {offerListings &&
                offerListings.length > 0 &&
                offerListings.map((listing) => (
                    <SwiperSlide>
                    <div
                        style={{
                        background: `url(${listing.imageUrls[0]}) center no-repeat`,
                        backgroundSize: 'contain',
                        }}
                        className='h-[500px]'
                        key={listing._id}
                    ></div>
                    </SwiperSlide>
                ))}
            </Swiper> */}

            {/* listing result fro offer, sale and rent */}

            <div className='max-w-6xl mx-auto p-4 flex flex-col gap-8 '>
                {offerListings && offerListings.length > 0 && (
                <div className=''>
                    <div className='my-3'>
                    <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
                    <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
                    </div>
                    <div className='flex flex-wrap gap-4'>
                    {offerListings.map((listing) => (
                        <ListingItem listing={listing} key={listing._id} />
                    ))}
                    </div>
                </div>
                )}
                {rentListings && rentListings.length > 0 && (
                <div className=''>
                    <div className='my-3'>
                    <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
                    <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
                    </div>
                    <div className='flex flex-wrap gap-4'>
                    {rentListings.map((listing) => (
                        <ListingItem listing={listing} key={listing._id} />
                    ))}
                    </div>
                </div>
                )}
                {saleListings && saleListings.length > 0 && (
                <div className=''>
                    <div className='my-3'>
                    <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
                    <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
                    </div>
                    <div className='flex flex-wrap gap-4'>
                    {saleListings.map((listing) => (
                        <ListingItem listing={listing} key={listing._id} />
                    ))}
                    </div>
                </div>
                )}
            </div>
            
        </div>
    )
}