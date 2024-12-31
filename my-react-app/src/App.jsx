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
import Me from "../auth/Me.jsx"; // Pastikan Anda mengimpor komponen Me
import Invoice from "../component/Invoices/Invoice.jsx";
import EditPassword from "../component/Edit/EditPassword.jsx";
import EditProfile from "../component/Edit/EditProfile.jsx";
import HomePage from "../component/HomePage/HomePage.jsx";
import ContactUs from "../component/ContactUs/ContactUs.jsx";
const App = () => {
  return (
    <Routes>
      {" "}
      {/* Pastikan semua Route berada di dalam Routes */}
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/not-found" />} />
      <Route path="/carts" element={<Cart />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/deliveryAddress" element={<Order />} />
      <Route path="/invoice/:order_id" element={<Invoice />} />
      <Route path="/not-found" element={<NotFound />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/editProfile/:id" element={<EditProfile />} />
      <Route path="/updatePassword/:id" element={<EditPassword />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      {/* Rute yang dilindungi */}
      <Route
        path="/me"
        element={
          <ProtectedRoute>
            <Me />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
