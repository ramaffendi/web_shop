import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Edit.css";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import EditAddress from "./EditAlamat";
import swal from "sweetalert";

const EditProfile = () => {
  const [user, setUser] = useState({}); // Pastikan user memiliki properti _id
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.REACT_APP_API_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data) {
          setUser(response.data); // Pastikan response.data memiliki properti _id
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Error fetching user data");
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user._id) {
      alert("User ID tidak ditemukan. Tidak bisa memperbarui data.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.REACT_APP_API_URL}/auth/updateProfile/${user._id}`, // Sertakan ID di URL
        user,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      swal("Good job!", "Profil sudah diperbarui", "success");
      navigate(`/me`);
    } catch (err) {
      console.error("Kesalahan saat memperbarui data pengguna:", err);
      setError(
        "Terjadi kesalahan saat memperbarui data. Silakan coba lagi nanti."
      );
    }
  };

  const handleNavigateToUpdatePassword = (id) => {
    if (id) {
      navigate(`/updatePassword/${id}`);
    } else {
      console.error("ID pengguna tidak ditemukan.");
      alert("Error: ID pengguna tidak ditemukan.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <div className="container-edit">
        <div className="box-edit-profile">
          <h2>Edit Profil</h2>
          <form onSubmit={handleSubmit}>
            <div className="box-edit-profile2">
              <label>Nama Lengkap:</label>
              <input
                type="text"
                name="name"
                value={user.name || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={user.email || ""}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Perbarui</button>
          </form>
          <button
            onClick={() => handleNavigateToUpdatePassword(user._id)}
            className="btn btn-secondary"
          >
            Ubah Kata Sandi
          </button>
        </div>
        <div className="box-edit-alamat">
          <EditAddress />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditProfile;
