import React, { useState } from "react";
import { motion } from "framer-motion";
import { styles } from "./styles/inlinestyles";
const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => { // Use async/await for promises
    e.preventDefault();
    const { name, email, password } = formData;

    if (!name || !email || !password) {
      setError("Please fill in all fields");
    } else {
      setError("");

      try {
        const response = await axios.post('/api/signup', formData); // Replace '/api/signup' with your actual endpoint
        console.log(response.data); // Handle successful response from the server (optional)
        // You can redirect to a different page or show a success message here
      } catch (error) {
        console.error(error); // Handle errors from the server
        setError("Signup failed. Please try again.");
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
            <label htmlFor="name" style={styles.label}>Name</label>
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
            <label htmlFor="email" style={styles.label}>Email</label>
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
            <label htmlFor="password" style={styles.label}>Password</label>
            <motion.input
              whileFocus={{ scale: 1.05 }}
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
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
