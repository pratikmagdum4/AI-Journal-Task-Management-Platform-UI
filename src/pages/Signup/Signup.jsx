import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus, Mail, Lock, Smartphone } from 'lucide-react';
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { BASE_URL } from "../../api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUid } from "../../redux/authSlice";
import Loading from '../../components/ui/Loading';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const id = useSelector(selectCurrentUid);

  useEffect(() => {
    if (id) {
      navigate("/login/u");
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, mobile } = formData;

    if (!name || !email || !password || !mobile) {
      setError("Please fill in all fields");
      toast.error("Please fill in all fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/signup`, formData);
      toast.success("Signup successful! Redirecting to login...");
      navigate("/login");
    } catch (error) {
      setLoading(false);
      const errorMsg = error.response?.data?.msg || "Signup failed. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
     <Navbar />
    <div className="mt-8 min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
     
      <ToastContainer />
      
      {loading ? (
        <Loading />
      ) : (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex items-center justify-center min-h-screen px-4 py-12"
        >
          <motion.div 
            variants={itemVariants}
            className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 space-y-6 
            border border-gray-100 transform transition duration-500 hover:scale-105"
          >
            <div className="text-center">
              <motion.h2 
                variants={itemVariants}
                className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center justify-center"
              >
                <UserPlus className="mr-3 text-blue-600" size={32} />
                Create Your Account
              </motion.h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <motion.div variants={itemVariants}>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserPlus className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="pl-10 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md 
                    focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                  />
                </div>
              </motion.div>

              {/* Email Input */}
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="pl-10 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md 
                    focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                  />
                </div>
              </motion.div>

              {/* Password Input */}
              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-gray-400" size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md 
                    focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                  />
                  <button
                    type="button"
                    onClick={handleShowPassword}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="text-gray-400" size={20} />
                    ) : (
                      <Eye className="text-gray-400" size={20} />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Mobile Input */}
              <motion.div variants={itemVariants}>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Smartphone className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter your mobile number"
                    className="pl-10 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md 
                    focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                  />
                </div>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.p 
                  variants={itemVariants}
                  className="text-red-500 text-sm text-center"
                >
                  {error}
                </motion.p>
              )}

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 
                  border border-transparent rounded-md shadow-sm 
                  text-sm font-medium text-white 
                  bg-gradient-to-r from-blue-500 to-purple-600 
                  hover:from-blue-600 hover:to-purple-700 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-blue-500 transition duration-300 
                  transform hover:scale-105 active:scale-95"
                >
                  Sign Up
                </button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
    </>
  );
};

export default Signup;