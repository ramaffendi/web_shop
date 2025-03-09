import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode"; // Gunakan ekspor default dari jwt-decode
import axios from "axios"; // Pastikan sudah diinstal
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialsResponse) => {
    try {
      const googleToken = credentialsResponse?.credential;

      // Decode token untuk memeriksa datanya (opsional, hanya untuk debug)
      const decoded = jwt_decode(googleToken); // Gunakan jwt_decode
      console.log("Decoded Google Tokens:", decoded);

      // Kirim token Google ke backend
      const response = await axios.post(
        `${import.meta.env.REACT_APP_API_URL}/auth/google`,
        {
          token: googleToken,
        }
      );

      // Simpan JWT yang diterima dari backend
      localStorage.setItem("token", response.data.token);

      // Redirect ke halaman setelah login berhasil
      navigate("/home");
    } catch (err) {
      console.error("Google Login Error:", err);
      alert("Google Login gagal. Silakan coba lagi.");
    }
  };

  const handleError = () => {
    console.error("Google Login gagal.");
    alert("Login dengan Google gagal.");
  };

  return (
    <GoogleOAuthProvider clientId="9555668885-tj8d0ivchi2g5rjt2ihfepkluev4bls6.apps.googleusercontent.com">
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
