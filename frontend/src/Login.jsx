import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
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
    axios
      .post("http://localhost:3001/login", formData)
      .then((response) => {
        if (response.status === 200) {
            console.log("User logged in:", response.data);
            navigate("/home"); // Redirect to dashboard on success
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        alert(error.response?.data || "Invalid credentials. Please try again.");
      });
};


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
    signupLinkContainer: {
      textAlign: "center",
      marginTop: "20px",
      fontSize: "14px",
    },
    signupLink: {
      color: "#007bff",
      textDecoration: "none",
      cursor: "pointer",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
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
        <button type="submit" style={styles.button}>Login</button>
      </form>
      <div style={styles.signupLinkContainer}>
        Don't have an account?{" "}
        <a href="/register" style={styles.signupLink}>Sign Up</a>
      </div>
    </div>
  );
};

export default Login;
