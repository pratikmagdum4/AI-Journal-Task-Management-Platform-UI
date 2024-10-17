import React, { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { styles } from "../../components/styles/inlinestyles";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { BASE_URL } from "../../api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "", // Add mobilenumber field
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, mobile } = formData; // Include mobile

    if (!name || !email || !password || !mobile) {
      setError("Please fill in all fields");
      toast.error("Please fill in all fields"); // Show error toast
    } else {
      setError("");
      console.log("The formdata is ", formData);

      try {
        const response = await axios.post(
          `${BASE_URL}/api/signup`,
          formData
        );

        console.log(response.data);

        if (response.data.success) {
          const userData = {
            id: response.data.user._id,
            name: response.data.user.name,
            role: response.data.user.role,
            token: response.data.token,
          };

          localStorage.setItem('userData', JSON.stringify(userData));

          // Show success toast
          toast.success("Signup successful! Redirecting to profile...");

          // Redirect to profile after a short delay
          setTimeout(() => {
            window.location.href = '/profile';
          }, 2000);

        } else {
          setError(response.data.msg || "Signup failed. Please try again.");
          toast.error(response.data.msg || "Signup failed. Please try again."); // Show error toast
        }
      } catch (error) {
        console.error("The error is", error.response?.data?.msg || error.message);
        setError(error.response?.data?.msg || "Signup failed. Please try again.");
        toast.error(error.response?.data?.msg || "Signup failed. Please try again."); // Show error toast
      }
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer /> {/* Toast Container to show toast notifications */}

      <div style={styles.container}>
        <motion.div
          className="signup-form"
          style={styles.form}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <h2 style={styles.title}>Create Your Account</h2>

          <form onSubmit={handleSubmit} style={styles.formGroup}>
            <div style={styles.inputGroup}>
              <label htmlFor="name" style={styles.label}>
                Name
              </label>
              <motion.input
                whileFocus={{ scale: 1.05 }}
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
              <motion.input
                whileFocus={{ scale: 1.05 }}
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <div style={styles.passwordInput}>
                <motion.input
                  whileFocus={{ scale: 1.05 }}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  style={styles.input}
                />
                <button
                  type="button"
                  onClick={handleShowPassword}
                  style={styles.showPasswordBtn}
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    style={styles.showPasswordIcon}
                  />
                </button>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="mobile" style={styles.label}>
                Mobile Number
              </label>
              <motion.input
                whileFocus={{ scale: 1.05 }}
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobilenumber}
                onChange={handleChange}
                placeholder="Enter your mobile number"
                style={styles.input}
              />
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#4b55d9" }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              style={styles.button}
            >
              Sign Up
            </motion.button>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default Signup;
