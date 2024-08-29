import { useSelector, useDispatch } from "react-redux"
import { useEffect, useRef, useState } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from "../firebase"
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    signOutUserStart,
    signOutUserFailure,
    signOutUserSuccess
} from '../redux/user/userSlice'
import { Link, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import { FaQuestionCircle } from "react-icons/fa"

export default function Profile() {
    const fileRef = useRef(null)
    const { currentUser, loading } = useSelector((state) => state.user)
    const [file, setFile] = useState(undefined)
    const [filePerc, setFilePerc] = useState(0)
    const [fileUploadError, setFileUploadError] = useState(false)
    const [formData, setFormData] = useState({})
    const [updatedFields, setUpdatedFields] = useState(new Set())
    const [showListingsError, setShowListingsError] = useState(false)
    const [showListings, setShowListings] = useState(false)
    const [userListings, setUserListings] = useState([])
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (file) {
            handleFileUpload(file)
        }
    }, [file])

    const handleFileUpload = (file) => {
        const storage = getStorage(app)
        const fileName = new Date().getTime() + file.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setFilePerc(Math.round(progress))
            },
            (error) => {
                setFileUploadError(true)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(
                    (downloadURL) => {
                        setFormData((prevFormData) => ({ ...prevFormData, avatar: downloadURL }))
                        setUpdatedFields(prev => new Set(prev.add('avatar')))
                    }
                )
            }
        )
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
        setUpdatedFields(prev => new Set(prev.add(e.target.id)))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            dispatch(updateUserStart())
            const res = await fetch(`http://localhost:5555/api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (data.success === false) {
                dispatch(updateUserFailure(data.message))
                return
            }
            dispatch(updateUserSuccess(data))

            let successMessage = 'Profile updated successfully!'
            if (updatedFields.size > 0) {
                successMessage = ''
                if (updatedFields.has('username')) successMessage += 'Username '
                if (updatedFields.has('email')) successMessage += 'Email '
                if (updatedFields.has('password')) successMessage += 'Password '
                if (updatedFields.has('avatar')) successMessage += 'Avatar '
                successMessage += 'updated successfully!';
            }
            Swal.fire({
                icon: 'success',
                title: successMessage,
                timer: 2000,
                timerProgressBar: true
            })
            setUpdatedFields(new Set())

        } catch (error) {
            dispatch(updateUserFailure(error.message))
        }
    }

    const handleDeleteUser = async () => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You will not be able to recover this account!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel'
            })
            if (result.isConfirmed) {
                dispatch(deleteUserStart())
                const res = await fetch(`http://localhost:5555/api/user/delete/${currentUser._id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                })
                const data = await res.json()
                if (data.success === false) {
                    dispatch(deleteUserFailure(data.message))
                    return
                }
                dispatch(deleteUserSuccess(data))
                navigate('/')
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }

    const handleSignOut = async () => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You will be signed out!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, sign out!',
                cancelButtonText: 'No, cancel'
            })
            if (result.isConfirmed) {
                dispatch(signOutUserStart())
                const res = await fetch('http://localhost:5555/api/auth/signout')
                const data = await res.json()
                if (data.success === false) {
                    dispatch(signOutUserFailure(data.message))
                    return
                }
                dispatch(signOutUserSuccess(data))
            }
        } catch (error) {
            dispatch(signOutUserFailure(error.message))
        }
    }

    const handleShowListings = async () => {
        try {
            setShowListingsError(false)
            const res = await fetch(`http://localhost:5555/api/user/listings/${currentUser._id}`, {
                credentials: 'include'
            })
            const data = await res.json()
            if (data.success === false) {
                setShowListingsError(true)
                return
            }
            setUserListings(data)
            setShowListings(true)
        } catch (error) {
            setShowListingsError(true)
        }
    }

    const handleHideListings = () => {
        setShowListings(false);
    }

    const handleListingDelete = async (listingId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You will not be able to recover this listing!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel'
            })
            if (result.isConfirmed) {
                const res = await fetch(`http://localhost:5555/api/listing/delete/${listingId}`, {
                    method: 'DELETE',
                    credentials: "include"
                })
                const data = await res.json()
                if (data.success === false) {
                    return
                }
                setUserListings((prev) => prev.filter((listing) => listing._id !== listingId))
            }
        } catch (error) {
        }
    }

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7 uppercase">
                Profile
            </h1>
            <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-4">
                <input
                    onChange={(e) => setFile(e.target.files[0])}
                    type="file" ref={fileRef}
                    hidden
                    accept="image/*"
                />
                <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="Profile"
                    className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
                />
                <p className="text-sm self-center">
                    {fileUploadError ? (
                        <span className="text-red-700">Error Image Upload (image must be less than 2 mb)</span>
                    ) : filePerc > 0 && filePerc < 100 ? (
                        <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
                    ) : filePerc === 100 ? (
                        <span className="text-green-700">Image successfully uploaded!</span>
                    ) : (
                        ''
                    )}
                </p>
                <input
                    type="text"
                    placeholder="Username"
                    defaultValue={currentUser.username}
                    id="username"
                    className="border p-3 rounded-lg"
                    onChange={handleChange}
                />
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Email"
                        defaultValue={currentUser.email}
                        id="email"
                        className="border p-3 rounded-lg"
                        disabled
                    />
                    <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
                        <FaQuestionCircle className="text-gray-600 cursor-pointer" title="Sorry, you cannot change your Gmail" />
                    </div>
                </div>
                <input
                    type="password"
                    placeholder="Password"
                    id="password"
                    className="border p-3 rounded-lg"
                />
                <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
                    {loading ? 'Loading...' : 'Update'}
                </button>
                <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95" to={'/create-listing'}>
                    Create Listing
                </Link>
            </form>
            <div className="flex justify-between mt-5">
                <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">
                    Delete Account
                </span>
                <span onClick={handleSignOut} className="text-blue-700 cursor-pointer">
                    Sign Out
                </span>
            </div>
            <div className="flex justify-center mt-5">
                {showListings ? (
                    <span
                        onClick={handleHideListings}
                        className="text-green-700 cursor-pointer flex"
                    >
                        Hide Listings
                    </span>
                ) : (
                    <span
                        onClick={handleShowListings}
                        className="text-green-700 cursor-pointer flex"
                    >
                        Show Listings
                    </span>
                )}
            </div>
            {showListings && (
                <>
                    <p className="text-red-700 mt-5">
                        {showListingsError ? 'Error showing listings!!' : ''}
                    </p>
                    {userListings && userListings.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            <h1 className="text-center mt-7 text-2xl font-semibold uppercase">
                                Your Listings
                            </h1>
                            {userListings.map((listing) => (
                                <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center">
                                    <Link to={`/listing/${listing._id}`}>
                                        <img
                                            src={listing.imageUrls[0]}
                                            alt="Listing Cover"
                                            className="h-24 w-25 object-contain"
                                        />
                                    </Link>
                                    <Link
                                        className="text-slate-700 font-semibold hover:underline truncate flex-1 ml-4"
                                        to={`/listing/${listing._id}`}
                                    >
                                        <p className="truncate">{listing.name}</p>
                                        <p className="truncate text-s">{listing.description}</p>
                                    </Link>
                                    <div className="flex flex-col items-end">
                                        <button onClick={() => handleListingDelete(listing._id)} className="text-red-700 uppercase">
                                            Delete
                                        </button>
                                        <Link to={`/update-listing/${listing._id}`}>
                                            <button className="text-gray-700 uppercase">
                                                Edit
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center mt-5">No listings found!</p>
                    )}
                </>
            )}
        </div>
    )
}
