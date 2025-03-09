import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import swal from "sweetalert";
const Signup = () => {
  const [name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Schema validasi menggunakan yup
  const schema = yup.object().shape({
    name: yup
      .string()
      .matches(/^\S*$/, "Full Name tidak boleh mengandung spasi")
      .required("Full Name wajib diisi"),
    email: yup
      .string()
      .matches(/^\S*$/, "Email tidak boleh mengandung spasi")
      .email("Email tidak valid")
      .required("Email wajib diisi"),
    password: yup
      .string()
      .matches(/^\S*$/, "Password tidak boleh mengandung spasi")
      .required("Password wajib diisi"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("➡️ Mencoba signup dengan data:", { name, email, password }); // ✅ Debugging data sebelum dikirim

    try {
      // Validasi input menggunakan schema yup
      await schema.validate({ name, email, password });
      console.log("✅ Data validasi yup berhasil");

      const response = await Axios.post(
        `${import.meta.env.REACT_APP_API_URL}/auth/signup`,
        {
          name,
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" }, // ✅ Pastikan header dikirim
          withCredentials: true,
        }
      );

      console.log("✅ Response dari backend:", response); // ✅ Debugging response dari backend

      if (response.status === 201) {
        swal("Good job", "Pendaftaran berhasil, silakan login", "success");
        navigate("/login");
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        console.error("❌ Error Validasi Yup:", error.errors[0]); // ✅ Debugging error validasi
        setErrorMessage(error.errors[0]);
      } else if (error.response) {
        console.error("❌ Error response dari backend:", error.response.data); // ✅ Debugging error dari backend
        setErrorMessage(error.response.data.message || "Terjadi kesalahan");
      } else {
        console.error("❌ Kesalahan lainnya:", error.message); // ✅ Debugging error lainnya
        setErrorMessage("Terjadi kesalahan");
      }
    }
  };

  return (
    <div className="sign-up-container-signup">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Signup</h2>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <label htmlFor="name">Full Name:</label>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn-submit">
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
