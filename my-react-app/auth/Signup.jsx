import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

const Signup = () => {
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Schema validasi menggunakan yup
  const schema = yup.object().shape({
    full_name: yup
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

    try {
      // Validasi input menggunakan schema yup
      await schema.validate({ full_name, email, password });

      const response = await Axios.post(
        "http://localhost:8080/auth/signup",
        {
          full_name,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        console.log(response.data);
        alert("Pendaftaran berhasil, silakan login");
        navigate("/login");
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        // Menampilkan pesan kesalahan dari yup
        setErrorMessage(error.errors[0]);
      } else if (error.response && error.response.data) {
        // Menampilkan pesan kesalahan dari backend
        setErrorMessage(error.response.data.message || "Terjadi kesalahan");
      } else {
        setErrorMessage("Terjadi kesalahan");
      }
    }
  };

  return (
    <div className="sign-up-container-signup">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Signup</h2>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <label htmlFor="full_name">Full Name:</label>
        <input
          type="text"
          placeholder="Full Name"
          value={full_name}
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
