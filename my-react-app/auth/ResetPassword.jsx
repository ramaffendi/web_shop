import { useState } from "react";
import "./style/app.css";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  // Schema validasi menggunakan yup
  const schema = yup.object().shape({
    password: yup
      .string()
      .matches(/^\S*$/, "Password tidak boleh mengandung spasi")
      .required("Password wajib diisi"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validasi input menggunakan schema yup
      await schema.validate({ password });

      const response = await Axios.post(
        `${import.meta.env.REACT_APP_API_URL}/auth/reset-password/${token}`,
        {
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data && response.data.status) {
        console.log("Response berhasil");
        navigate("/login");
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        // Menampilkan pesan kesalahan dari yup
        setErrorMessage(error.errors[0]);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <div className="sign-up-container-reset">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h3>reset password</h3>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <label htmlFor="password">new password:</label>
        <input
          type="password"
          placeholder="*********"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn-submit">
          reset
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
