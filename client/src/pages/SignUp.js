import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

export default function SignUp() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        username: Yup.string()
            .min(3, 'Username must be at least 3 characters!')
            .required('Username is required!'),
        email: Yup.string()
            .email('Invalid email address!')
            .required('Email is required!'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters!')
            .required('Password is required!'),
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const res = await axios.post('/auth/signup', values, {
                    withCredentials: true
                });
                const data = res.data;
                if (data.message) {
                    if (data.message.includes('Username is already taken') || data.message.includes('Email is already taken')) {
                        setLoading(false);
                        Swal.fire({
                            title: 'Registration Failed',
                            text: data.message,
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                        return;
                    } else if (data.message.includes('Password must be at least 7 characters long')) {
                        setLoading(false);
                        Swal.fire({
                            title: 'Invalid Password',
                            text: data.message,
                            icon: 'warning',
                            confirmButtonText: 'OK'
                        });
                        return;
                    }
                }
                setLoading(false);
                Swal.fire({
                    title: 'Success!',
                    text: 'Registered Successfully! Please verify your email with the OTP sent to you.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate('/verify-otp', { state: { email: values.email } });
                });
            } catch (error) {
                setLoading(false);
                const errorMessage = error.response?.data?.message || 'An unknown error occurred!';
                setError(errorMessage);
                Swal.fire({
                    title: 'Registration Failed',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    });

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7 uppercase'>
                Sign Up
            </h1>
            <form onSubmit={formik.handleSubmit} className='flex flex-col gap-4'>
                <input 
                    type='text'
                    placeholder='Username'
                    id='username'
                    className='border p-3 rounded-lg'
                    {...formik.getFieldProps('username')}
                />
                {formik.touched.username && formik.errors.username ? (
                <div className='text-red-500 text-sm text-center'>{formik.errors.username}</div>
                ) : null}

                <input 
                    type='text'
                    placeholder='Email'
                    id='email'
                    className='border p-3 rounded-lg'
                    {...formik.getFieldProps('email')}
                />

                {formik.touched.email && formik.errors.email ? (
                        <div className='text-red-500 text-sm text-center'>{formik.errors.email}</div>
                    ) : null}

                <input 
                    type='password'
                    placeholder='Password'
                    id='password'
                    className='border p-3 rounded-lg'
                    {...formik.getFieldProps('password')}
                />
                {formik.touched.password && formik.errors.password ? (
                    <div className='text-red-500 text-sm text-center'>{formik.errors.password}</div>
                ) : null}

                <button 
                    type="submit"
                    disabled={loading} 
                    className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                    {loading ? 'Loading...' : 'Sign Up'}
                </button>

                <OAuth />
            </form>
            <div className='flex gap-2 mt-5'>
                <p>
                    Have an account?
                </p>
                <Link to='/sign-in'>
                    <span className='text-blue-700'>
                        Sign in
                    </span>
                </Link>
            </div>
            {error && <p className='text-red-500 mt-5'>{error}</p>}
        </div>
    );
}
