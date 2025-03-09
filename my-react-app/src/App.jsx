import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../auth/Login";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPassword";
import Signup from "../auth/Signup.jsx";
import Home from "../component/Home.jsx";
import Cart from "../component/Cart/Cart.jsx";
import NotFound from "../component/NotFound/NotFound.jsx";
import Order from "../component/PlaceOrder/PlaceOrder.jsx";
import ProtectedRoute from "../auth/ProtectRoute.jsx";
import Me from "../auth/Me.jsx";
import Invoice from "../component/Invoices/Invoice.jsx";
import EditPassword from "../component/Edit/EditPassword.jsx";
import EditProfile from "../component/Edit/EditProfile.jsx";
import HomePage from "../component/HomePage/HomePage.jsx";
import ContactUs from "../component/ContactUs/ContactUs.jsx";
import LoginFromGoogle from "../auth/LoginFromGoogle.jsx"; // ✅ Tambahkan ini
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Wajib diimport agar toast tampil dengan benar

const App = () => {
  return (
    <>
      <Routes>
        {/* Pastikan semua Route berada di dalam Routes */}
        <Route path="*" element={<Navigate to="/not-found" />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carts"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact-us"
          element={
            <ProtectedRoute>
              <ContactUs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/deliveryAddress"
          element={
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoice/:order_id"
          element={
            <ProtectedRoute>
              <Invoice />
            </ProtectedRoute>
          }
        />

        {/* Rute yang tidak dilindungi */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Rute untuk menangkap callback dari Google OAuth */}
        <Route path="/auth/google/callback" element={<LoginFromGoogle />} />

        {/* Rute yang dilindungi */}
        <Route
          path="/me"
          element={
            <ProtectedRoute>
              <Me />
            </ProtectedRoute>
          }
        />

        {/* Halaman Not Found */}
        <Route path="/not-found" element={<NotFound />} />

        {/* Edit Profile dan Edit Password */}
        <Route path="/editProfile/:id" element={<EditProfile />} />
        <Route path="/updatePassword/:id" element={<EditPassword />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
