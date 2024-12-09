import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { BASE_URL } from '../../api';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setUserInfo } from '../../redux/authSlice';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Navbar from '../Navbar/Navbar';

function Login() {
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (event) => {
        setLoginData({
            ...loginData,
            [event.target.name]: event.target.value,
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/api/login`, loginData);

            if (response && response.status === 200 && response.data.token) {
                const { token, result, role, email } = response.data;

                dispatch(setUserInfo({
                    user: result,
                    token: token,
                    Uid: result._id,
                    Name: result.name,
                    Role: role,
                    Email: email,
                }));

                setTimeout(() => {
                    navigate('/login/u');
                }, 3000);
            }
        } catch (error) {
            console.error("Login error: ", error);
            setLoading(false);
            setError(error.response?.data?.message || "An unexpected error occurred. Please try again.");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <> 
        <Navbar/>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                            <p className="text-gray-500 mt-2">Sign in to continue</p>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                {/* Email Input */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Email address"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                        value={loginData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Password Input */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        placeholder="Password"
                                        className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                        value={loginData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <p className="text-red-500 text-sm text-center">{error}</p>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
                                >
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </button>
                            </div>
                        </form>

                        {/* Additional Links */}
                        <div className="text-center mt-6">
                            <a href="/forgot-password" className="text-blue-600 hover:underline text-sm">
                                Forgot Password?
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
        </>
    );
}

export default Login;