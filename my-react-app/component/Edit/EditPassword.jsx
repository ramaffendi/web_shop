import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

const EditPassword = () => {
  const { id } = useParams(); // Ambil ID dari URL
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validasi password
    if (newPassword !== confirmPassword) {
      setError("Password baru dan konfirmasi password tidak cocok.");
      return;
    }

    if (newPassword === oldPassword) {
      setError("Password baru tidak boleh sama dengan password lama.");
      return;
    }

    if (newPassword.length < 6) {
      // Tambahkan validasi kompleksitas password
      setError("Password baru harus memiliki setidaknya 6 karakter.");
      return;
    }

    setIsLoading(true);
    try {
      // Mengambil token dari localStorage
      const token = localStorage.getItem("token");

      // Jika token tidak ada
      if (!token) {
        setError("Anda tidak memiliki akses. Silakan login terlebih dahulu.");
        setIsLoading(false);
        return;
      }

      // Kirim request untuk mengubah password
      await axios.put(
        `http://localhost:8080/auth/updatePassword/${id}`, // Menggunakan ID dari URL
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Menggunakan token JWT
          },
        }
      );

      // Menampilkan pesan sukses
      setSuccess("Password berhasil diubah.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Navigasi kembali setelah sukses
      setTimeout(() => {
        navigate("/"); // Atau bisa mengarahkan ke halaman lain
      }, 1500);
    } catch (error) {
      // Menampilkan error jika gagal
      if (error.response) {
        // Jika server mengembalikan response error
        setError(
          error.response.data.message ||
            "Gagal mengubah password, silakan coba lagi."
        );
      } else {
        setError("Terjadi kesalahan jaringan. Silakan coba lagi nanti.");
      }
      console.error("Error updating password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="edit-password-container">
        <h2>Ubah Password</h2>

        {/* Menampilkan error atau sukses */}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="oldPassword">Password Lama</label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">Password Baru</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Konfirmasi Password Baru</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? "Memproses..." : "Ubah Password"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditPassword;
