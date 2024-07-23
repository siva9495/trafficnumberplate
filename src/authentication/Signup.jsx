import React, { useState } from 'react';
import { IoPersonCircle } from "react-icons/io5";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { app, db, auth } from '../firebase';  // Ensure these imports are correct
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const navigate= useNavigate()
    const [message,setMessage] = useState(null)
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        password: '',
        type: 'BlindPeople'
    });

    const inputHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const user = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            toast.success('User created successful',{
                autoClose:2000,
                onClose:()=>navigate('/signin')
            })
            
            console.log(user);
        } catch (error) {
            console.error(error);
            setMessage(error.message)
        }
    };

    console.log(formData);

    const backgroundImage = '';
    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 lg:py-28 "
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                }}>
                <div className='bg-slate-50 border shadow-md sm:mx-auto sm:w-full sm:max-w-md px-3 my-3 rounded-md bg-opacity-35'>
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm py-3">
                        <IoPersonCircle className="mx-auto h-14 w-14 text-blue-700" />
                        <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Sign Up to your account
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className="space-y-6" onSubmit={submitHandler}>
                            <div>
                                <label htmlFor="displayName" className="block text-sm font-medium leading-6 text-gray-900">
                                    Username
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="displayName"
                                        name="username"
                                        type="text"
                                        autoComplete="displayName"
                                        onChange={inputHandler}
                                        value={formData.displayName}
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        onChange={inputHandler}
                                        value={formData.email}
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="password"
                                        onChange={inputHandler}
                                        value={formData.password}
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </form>
                        {message && (
                        <div className='mt-4 text-center text-sm text-red-600'>
                            {message}
                        </div>
                        )}
                        <p className="mt-10 text-center text-sm mb-3">
                            Already a member?{' '}
                            <a href="/signin" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
                <ToastContainer/>
            </div>
        </>
    );
}
