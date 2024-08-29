import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function VerifyOTP() {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleVerifyOTP = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5555/api/auth/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Your email has been verified successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate('/sign-in');
                });
            } else {
                throw new Error(data.message || 'Invalid OTP or OTP expired!');
            }
        } catch (error) {
            setLoading(false);
            Swal.fire({
                title: 'Verification Failed',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7 uppercase'>
                Verify OTP
            </h1>
            <div className='flex flex-col gap-4'>
                <input 
                    type='text'
                    placeholder='Enter OTP'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className='border p-3 rounded-lg'
                />
                <button 
                    onClick={handleVerifyOTP}
                    disabled={loading} 
                    className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                    {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
            </div>
        </div>
    );
}
