// auth/ProtectedRoute.jsx
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem("token"); // Ganti dengan logika yang sesuai

  return isLoggedIn ? children : <Navigate to="/login" />;
};

// Tambahkan validasi PropTypes
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
