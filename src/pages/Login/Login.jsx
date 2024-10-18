import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// import { loginSuccess } 
import Navbar from '../Navbar/Navbar';
import { BASE_URL } from '../../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isAuthenticated,setUserInfo } from '../../redux/authSlice';
function Login() {
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");  // New error state
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (event) => {
        setLoginData({
            ...loginData,
            [event.target.name]: event.target.value,
        });
        setError("");  // Clear error when the user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Make login request
            const response = await axios.post(`${BASE_URL}/api/login`, loginData);
            console.log("The response is", response);

            // Check if the response was successful
            if (response && response.status === 200 && response.data.token) {
                const token = response.data.token;  // The token from the response
                const userId = response.data.result._id;  // Extracting userId
                const name = response.data.result.name;  // Extracting Name
                const role = response.data.role;  // Extracting Role

                // Dispatch setUserInfo to update the Redux store and trigger localStorage saving
                dispatch(setUserInfo({
                    user: response.data.result,
                    token: token,
                    Uid: userId,
                    Name: name,
                    Role: role,
                }));

                console.log("Token, User ID, Name, Role, ", token, userId, name, role, );

                // Optional: Show success toast
                // toast.success('Login successful!', { autoClose: 3000 });

                // Redirect to the dashboard after a short delay
                setTimeout(() => {
                    navigate('/login/u');
                }, 3000); // 3 seconds delay for toast
            }
        } catch (error) {
            console.error("Login error: ", error);

            // Handle error and set error state for displaying on UI
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };



    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <Navbar />
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
                                name="email"
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
                                name="password"
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

                        {/* Display the error message if it exists */}
                        {error && (
                            <p className="text-red-500 text-sm mb-4">{error}</p>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>

            {/* Add ToastContainer to render the toast notifications */}
            <ToastContainer />
        </>
    );
}

export default Login;
