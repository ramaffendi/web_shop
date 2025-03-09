import { useState } from "react";
import "./style/app.css";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert"; // Import SweetAlert

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // State untuk loading
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Saat submit, set loading jadi true

    try {
      const response = await Axios.post(
        `${import.meta.env.REACT_APP_API_URL}/auth/forgot-password`,
        { email }
      );

      if (response.data.status === "success") {
        swal(
          "Success!",
          "Check your email for reset instructions.",
          "success"
        ).then(() => {
          navigate("/login");
        });
      } else {
        swal(
          "Error",
          response.data.message || "Email tidak ditemukan",
          "error"
        );
      }
    } catch (err) {
      if (err.response) {
        swal(
          "Error",
          err.response.data.message || "Email tidak ditemukan",
          "error"
        );
      } else {
        swal(
          "Error",
          "Terjadi kesalahan pada server. Silakan coba lagi.",
          "error"
        );
      }
      console.error(err);
    } finally {
      setLoading(false); // Set loading kembali ke false setelah selesai
    }
  };

  return (
    <div className="sign-up-container-forgot">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Forgot password</h2>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          autoComplete="off"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
