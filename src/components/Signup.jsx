import React, { useState } from "react";
import { motion } from "framer-motion";

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
  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, password } = formData;

    if (!name || !email || !password) {
      setError("Please fill in all fields");
    } else {
      setError("");

      // Save the details to local storage
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
      existingUsers.push(formData);
      localStorage.setItem("users", JSON.stringify(existingUsers));

      // Reset form
      setFormData({ name: "", email: "", password: "" });

      // Show success message
      alert("Signup successful! Your details have been saved.");
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

// Inline styling
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    fontFamily: "'Arial', sans-serif",
  },
  form: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  title: {
    marginBottom: "1.5rem",
    fontSize: "2rem",
    color: "#333",
  },
  inputGroup: {
    marginBottom: "1rem",
    textAlign: "left",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontSize: "1rem",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    transition: "all 0.2s ease-in-out",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#5c67f2",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "1.2rem",
    cursor: "pointer",
    marginTop: "1rem",
    transition: "background-color 0.3s ease",
  },
  error: {
    color: "red",
    fontSize: "0.9rem",
    marginTop: "0.5rem",
  },
};

export default Signup;
