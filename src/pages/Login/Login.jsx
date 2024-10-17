import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { BASE_URL } from '../../api';

function Login({ onLogin }) {
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const handleChange = (event) => {
        setLoginData({
            ...loginData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Use loginData for email and password
        try {
            const response = await axios.post(
                `${BASE_URL}/api/login`,
                loginData
            );
            console.log(response.data); // Handle successful login response
            if (response.data.status === 'success' && response.data.data) {
                const user = response.data.data; // Extract user data
                localStorage.setItem('loggedInUser', JSON.stringify(user)); // Store in Local Storage (caution: not secure)
                onLogin(true); // Call onLogin prop with success flag
            } 
            navigate('/login/u')
            // else {
            //     console.error('Login failed'); // Handle failed login
            // }
        } catch (error) {
            console.error(error); // Handle errors from the server
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
        <Navbar/>
       
        <div className="flex h-screen items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Login
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
                            Username (Email)
                        </label>
                        <input
                            type="text"
                            id="email"
                            name="email" // Use name for state access
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={loginData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-6 relative">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password" // Use name for state access
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={loginData.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 px-4 py-2 text-gray-600"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
        </>
    );
}

export default Login;
