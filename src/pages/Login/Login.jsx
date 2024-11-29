import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Navbar from '../Navbar/Navbar';
import { BASE_URL } from '../../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isAuthenticated, setUserInfo } from '../../redux/authSlice';
import Loading from '../../components/ui/Loading';
import { eyehide } from '../../assets/exportImages';
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
            console.log("The response is", response);

            if (response && response.status === 200 && response.data.token) {
                const token = response.data.token;
                const userId = response.data.result._id;
                const name = response.data.result.name;
                const role = response.data.role;
                const email = response.data.email;

                dispatch(setUserInfo({
                    user: response.data.result,
                    token: token,
                    Uid: userId,
                    Name: name,
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
            {loading ? (
                <Loading />
            ) : (
                <div className="flex h-screen items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Username (Email)</label>
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
                                <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">Password</label>
                                <div className="flex items-center">
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
                                        className="ml-2 text-gray-600 focus:outline-none"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? (
                                                <span role="img" aria-label="Hide Password">
                                                    <div className='h-5 w-5'>
                                                        <img src={eyehide} alt="" />
                                                    </div>
                                                  </span>
                                        ) : (
                                                    <span role="img" aria-label="Show Password">👁️</span>
                                        )}
                                    </button>
                                </div>
                            </div>

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
            )}
            <ToastContainer />
        </>
    );
}

export default Login;
