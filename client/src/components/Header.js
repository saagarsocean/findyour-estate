import {FaSearch} from 'react-icons/fa'
import { BiSolidHomeAlt2 } from 'react-icons/bi'
import { RiCustomerServiceFill } from "react-icons/ri"
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

export default function Header() {
    const { currentUser } = useSelector((state) => state.user)
    const [searchTerm, setSearchTerm] = useState('')

    const navigate = useNavigate()
    const location = useLocation()

    const handleSubmit = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams(window.location.search)
        urlParams.set('searchTerm', searchTerm)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    useEffect(() => {
        setSearchTerm('')
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        if(searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl)
        }
    }, [location.search])

    return (
        <header className="bg-slate-200 shadow-md">
            <div className="flex justify-between items-center max-w-6xl mx-auto p-6">
                <Link to='/'>
                    <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                        <span className="text-slate-500 uppercase text-2xl">
                            FindYour-
                        </span>
                        <span className="text-slate-700 uppercase text-2xl">
                            Estate
                        </span>
                    </h1>
                </Link>
                <form onSubmit={handleSubmit} className="bg-slate-100 p-3 rounded-lg flex items-center">
                    <input 
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent focus:outline-none w-24 sm:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button>
                        <FaSearch className='text-slate-600' />
                    </button>
                </form>
                <ul className='flex gap-8'>
                    <Link to='/'>
                        <li className='hidden sm:inline text-slate-700'>
                            <BiSolidHomeAlt2 className='text-4xl mr-2' title='Home' />
                            
                        </li>
                    </Link>
                    <Link to='/about'>
                        <li className='hidden sm:inline text-slate-700 font-bold uppercase' title='Get in touch'>
                            <RiCustomerServiceFill className='text-4xl mr-2' />
                        </li>
                    </Link>
                    {/* {currentUser?.isAdmin && (
                        <Link to='/admin/unverified'>
                            <li className='hidden sm:inline text-slate-700 text-2xl font-bold uppercase' title='Unverified Lists'>
                                Unverified Lists
                            </li>
                        </Link>
                    )} */}
                    <Link to='/profile'>
                    {currentUser ? (
                        <img 
                            className='rounded-full h-9 w-9 object-cover border' title='Profile'
                            src={currentUser.avatar} alt='Profile' />
                    ):(
                        <li className='text-slate-700 font-bold uppercase mt-1 text-xl'>
                            Sign In
                        </li>
                    )}
                    </Link>
                </ul>
            </div>
        </header>
    )
}