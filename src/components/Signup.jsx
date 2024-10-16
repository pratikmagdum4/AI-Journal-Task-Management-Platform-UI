import React, { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"; 
import { styles } from "./styles/inlinestyles";
import axios from "axios";

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
    const { name, email, password, mobile } = formData; // Include mobilenumber

    if (!name || !email || !password || !mobile) {
      setError("Please fill in all fields");
    } else {
      setError("");
      console.log("The formdata is ", formData);

      try {
        const response = await axios.post(
          "http://localhost:5000/api/signup",
          formData
        );

        console.log(response.data);

        if (response.data.success) { // Check for successful signup in the response
          const userData = {
            id: response.data.user._id, // Assuming user ID is in response.data.user._id
            name: response.data.user.name,
            role: response.data.user.role, // Assuming role is in response.data.user.role
            token: response.data.token, // Assuming token is in response.data.token
          };

          // Store user data in localStorage
          localStorage.setItem('userData', JSON.stringify(userData));

          // You can redirect to a different page or show a success message here
          // For example, redirect to a profile page:
          window.location.href = '/profile';
        } else {
          // Handle signup failure if the response doesn't indicate success
          console.error("The error is here ", response.data.error.response.data.msg);
          setError(response.data.msg || "Signup failed. Please try again.");
        }
      } catch (error) {
        console.error("The error is", error.response.data.msg);
        setError(error.response.data.msg||"Signup failed. Please try again.");
      }
    }
  };
  return (
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
  );
};

export default Signup;