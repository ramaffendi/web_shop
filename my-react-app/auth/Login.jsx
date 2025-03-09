import { useState, useEffect } from "react";
import "./style/app.css";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
// import GoogleLoginButton from "./GoogleSign";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // **1️⃣ Tangkap token dari URL setelah login Google**
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    console.log("Token dari URL:", token); // Debug token

    if (token) {
      localStorage.setItem("token", token);
      console.log("Token berhasil disimpan di localStorage:", token);
      navigate("/home"); // Redirect ke halaman home setelah login sukses
    }
  }, [navigate]);

  // **2️⃣ Login Manual (Email & Password)**
  const handleSubmit = (e) => {
    e.preventDefault();

    Axios.post(`${import.meta.env.REACT_APP_API_URL}/auth/login`, {
      email,
      password,
    })
      .then((response) => {
        if (response.data.status) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("_id", response.data.user._id);
          console.log("Token saved:", localStorage.getItem("token"));
          navigate("/home");
        }
      })
      .catch((err) => {
        console.error("Error during login:", err);
        alert(
          "Login gagal: " +
            (err.response?.data?.message || "Silakan coba lagi.")
        );
      });
  };

  return (
    <div className="sign-up-container-login">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          autoComplete="off"
          placeholder="Masukkan email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          placeholder="*********"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="btn-submit">
          Login
        </button>

        <Link to="/forgotPassword">Forgot password?</Link>
        <label>
          Do not have an account? <Link to="/signup">Signup</Link>
        </label>
        {/* <GoogleLoginButton /> */}
      </form>
    </div>
  );
};

export default Login;
