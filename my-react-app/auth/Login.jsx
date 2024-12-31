import { useState } from "react";
import "./style/app.css";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kirim permintaan login
    Axios.post(
      "http://localhost:8080/auth/login",
      { email, password },
      {
        withCredentials: true, // Pastikan credentials ikut dikirim
      }
    )
      .then((response) => {
        if (response.data.status) {
          // Simpan token di localStorage
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("_id", response.data.user._id);

          // Navigasi ke halaman utama setelah login sukses
          navigate("/home");
        }
      })
      .catch((err) => {
        // Menangani error saat login
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
      </form>
    </div>
  );
};

export default Login;
