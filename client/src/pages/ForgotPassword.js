import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setEmail(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await fetch('http://localhost:5555/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            })
            const data = await response.json()

            if (data.success === false) {
                setError(data.message)
                Swal.fire({
                    title: 'Error',
                    text: data.message || 'An error occurred. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            } else {
                Swal.fire({
                    title: 'Success!',
                    text: 'OTP has been sent to your email.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate('/reset-password')
                })
            }
        } catch (error) {
            setError('Network error')
            Swal.fire({
                title: 'Error',
                text: 'An error occurred. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7 uppercase'>
                Forgot Password
            </h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input 
                    type='email'
                    placeholder='Registered Email'
                    value={email}
                    onChange={handleChange}
                    className='border p-3 rounded-lg'
                />
                <button 
                    type="submit" 
                    disabled={loading} 
                    className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                    {loading ? 'Loading...' : 'Send OTP'}
                </button>
                {error && <p className='text-red-500 mt-5'>{error}</p>}
            </form>
        </div>
    )
}
