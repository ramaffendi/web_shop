import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoogleUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/auth/google/callback",
          {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Pastikan cookies diterima dari backend
          }
        );

        console.log("Response:", response.data);
        localStorage.setItem("token", response.data.token); // Simpan token
        navigate("/home"); // Redirect ke halaman profil
      } catch (error) {
        console.error("Error fetching Google user:", error);
        navigate("/login"); // Kembali ke login jika gagal
      }
    };

    fetchGoogleUser();
  }, [navigate]);

  return <p>Logging in...</p>;
}

export default LoginCallback;
