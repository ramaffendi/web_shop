// Me.js - Komponen utama
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../component/Navbar/Navbar";
import Footer from "../component/Footer/Footer";
import { useNavigate } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/app.css";
import swal from "sweetalert";
import ProfileContent from "./ProfilContent";

function Me() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [newAddress, setNewAddress] = useState({
    nama: "",
    kelurahan: "",
    kecamatan: "",
    kabupaten: "",
    provinsi: "",
    detail: "",
  });
  const navigate = useNavigate();
  const [visibleOrders, setVisibleOrders] = useState(5);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      console.log("Token di localStorage:", token);
      if (!token) {
        console.error("Token tidak ditemukan, mengarahkan ke login.");
        navigate("/login");
        return;
      }

      try {
        const [profileResponse, ordersResponse] = await Promise.all([
          axios.get(`${import.meta.env.REACT_APP_API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true, // ✅ Perbaiki di sini
          }),

          axios.get(`${import.meta.env.REACT_APP_API_URL}/api/orders`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true, // ✅ Perbaiki di sini
          }),
        ]);
        setUser(profileResponse.data);
        console.log("user", profileResponse.data);
        setOrders(
          Array.isArray(ordersResponse.data.data)
            ? ordersResponse.data.data
            : []
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        swal("Error", "Gagal mengambil data", "error");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleAddressChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleAddressSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (Object.values(newAddress).some((value) => !value.trim())) {
        swal("Error", "Harap lengkapi semua kolom alamat", "error");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        await axios.post(
          `${import.meta.env.REACT_APP_API_URL}/api/delivery-addresses`,
          newAddress,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        swal("Success", "Alamat berhasil ditambahkan!", "success");
        setNewAddress({
          nama: "",
          kelurahan: "",
          kecamatan: "",
          kabupaten: "",
          provinsi: "",
          detail: "",
        });
      } catch (error) {
        console.error("Error adding address:", error);
        swal("Error", "Gagal menambahkan alamat", "error");
      }
    },
    [newAddress]
  );

  const goToEditProfile = useCallback(
    (id) => {
      navigate(`/editProfile/${id}`);
    },
    [navigate]
  );

  const OrdersContent = () => (
    <div className="order-box">
      <h3>My Orders</h3>
      <Accordion className="order-head">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.slice(0, visibleOrders).map((order, index) => (
            <Accordion.Item
              key={order._id}
              eventKey={index.toString()}
              className="order-item"
            >
              <Accordion.Header>
                Order ID: {order._id} - Status: {order.status}
              </Accordion.Header>
              <Accordion.Body>
                <p>
                  <strong>Nama lengkap:</strong> {order.delivery_address.nama}
                </p>
                <p>
                  <strong>Alamat:</strong> {order.delivery_address.detail},{" "}
                  {order.delivery_address.provinsi},{" "}
                  {order.delivery_address.kabupaten},{" "}
                  {order.delivery_address.kecamatan},{" "}
                  {order.delivery_address.kelurahan}
                </p>
                <p>
                  Tanggal pesanan:{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <div className="box-items-header-orders">
                  <p>
                    <strong>Items:</strong>
                  </p>
                  <div className="items-products-list">
                    {order.order_items.length > 0 ? (
                      order.order_items.map((item, idx) => (
                        <div key={idx} className="items-orders-list">
                          <span>{item.name}</span>
                          <span>{item.qty} pcs</span>
                        </div>
                      ))
                    ) : (
                      <p>Tidak ada item dalam pesanan.</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/invoice/${order._id}`)}
                  className="btn btn-primary mt-3"
                >
                  View Invoice
                </button>
              </Accordion.Body>
            </Accordion.Item>
          ))
        )}
      </Accordion>
      {visibleOrders < orders.length && (
        <button
          onClick={() => setVisibleOrders((prev) => prev + 5)}
          className="btn btn-secondary mt-3"
        >
          Load More Orders
        </button>
      )}
    </div>
  );

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="tab-buttons">
          <button
            className={`btn ${
              activeTab === "profile" ? "btn-primary" : "btn-secondary"
            } me-2`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`btn ${
              activeTab === "orders" ? "btn-primary" : "btn-secondary"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            My Orders
          </button>
        </div>

        <div className="tab-content mt-4">
          {activeTab === "profile" ? (
            <ProfileContent
              user={user}
              newAddress={newAddress}
              onAddressChange={handleAddressChange}
              onAddressSubmit={handleAddressSubmit}
              onEditProfile={goToEditProfile}
            />
          ) : (
            <OrdersContent />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Me;
