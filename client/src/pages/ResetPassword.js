import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function ResetPassword() {
    const [formData, setFormData] = useState({
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match!');
            return;
        }
    
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5555/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    otp: formData.otp,
                    newPassword: formData.newPassword
                }),
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.message || 'An unknown error occurred!');
            }
    
            Swal.fire({
                title: 'Success!',
                text: 'Password reset successfully',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                navigate('/sign-in');
            });
        } catch (error) {
            setLoading(false);
            setError(error.message);
            Swal.fire({
                title: 'Reset Failed',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };
    

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7 uppercase'>
                Reset Password
            </h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input
                    type='text'
                    placeholder='Enter OTP'
                    id='otp'
                    className='border p-3 rounded-lg'
                    onChange={handleChange}
                    value={formData.otp}
                />
                <input
                    type='password'
                    placeholder='New Password'
                    id='newPassword'
                    className='border p-3 rounded-lg'
                    onChange={handleChange}
                    value={formData.newPassword}
                />
                <input
                    type='password'
                    placeholder='Confirm New Password'
                    id='confirmPassword'
                    className='border p-3 rounded-lg'
                    onChange={handleChange}
                    value={formData.confirmPassword}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                    {loading ? 'Loading...' : 'Reset Password'}
                </button>
            </form>
            {error && <p className='text-red-500 mt-5'>{error}</p>}
        </div>
    );
}
