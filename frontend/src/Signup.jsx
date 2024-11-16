import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }; 

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, email, password } = formData;
    axios.post('http://localhost:3001/register', { name:username, email, password })
      .then(response => {
        console.log("User registered:", response.data);
        navigate('/login');
      })
      .catch(error => {
        console.log("Error during registration:", error);
      });
    console.log("Form Data Submitted:", formData);
  };

  const handleGoogleSuccess = (response) => {
    console.log("Google Sign-In Success:", response);
    // Send token to backend to verify & register/login user
  };

  const handleGoogleFailure = (error) => {
    console.log("Google Sign-In Error:", error);
  };

  // Inline styles in JSX with enhanced styling
  const styles = {
    container: {
      maxWidth: "400px",
      margin: "60px auto",
      padding: "25px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#fff",
    },
    title: {
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "26px",
      color: "#333",
      fontWeight: "600",
    },
    form: {
      display: "flex",
      flexDirection: "column",
    },
    label: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "15px",
      fontWeight: "bold",
      color: "#555",
      fontSize: "14px",
    },
    input: {
      padding: "10px",
      width: "100%",
      marginTop: "5px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      fontSize: "16px",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.3s",
    },
    button: {
      padding: "12px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold",
      transition: "background-color 0.3s",
      marginTop: "20px",
    },
    googleButtonContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: "25px",
    },
    loginLinkContainer: {
      textAlign: "center",
      marginTop: "20px",
      fontSize: "14px",
    },
    loginLink: {
      color: "#007bff",
      textDecoration: "none",
      cursor: "pointer",
      fontWeight: "bold",
    },
  };

  return (
    <GoogleOAuthProvider clientId="559798091838-e3ctusoeh6m8nopq2g9ruvfmha90bblb.apps.googleusercontent.com">
      <div style={styles.container}>
        <h2 style={styles.title}>Signup</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </label>
          <label style={styles.label}>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </label>
          <label style={styles.label}>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </label>
          <button type="submit" style={styles.button}>Signup</button>
        </form>
        <div style={styles.googleButtonContainer}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
          />
        </div>
        <div style={styles.loginLinkContainer}>
          Already an existing user?{" "}
          <a href="/login" style={styles.loginLink}>Login</a>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Signup;
