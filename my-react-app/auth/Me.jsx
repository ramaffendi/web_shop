import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../component/Navbar/Navbar";
import Footer from "../component/Footer/Footer";
import { useNavigate } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/app.css";

function Me() {
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [newAddress, setNewAddress] = useState({
    nama: "",
    kelurahan: "",
    kecamatan: "",
    kabupaten: "",
    provinsi: "",
    detail: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // FETCH USER PROFILE
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token tidak ditemukan");
          return;
        }

        const response = await axios.get("http://localhost:8080/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    // FETCH USER ORDER
    const fetchUserOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token tidak ditemukan");
          return;
        }

        const response = await axios.get("http://localhost:8080/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(Array.isArray(response.data.data) ? response.data.data : []);
        console.log("order", response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchUserProfile();
    fetchUserOrders();
  }, []);

  // MENAMBAHKAN ALAMAT PENGIRIMAN
  const addAddress = async () => {
    if (
      !newAddress.nama.trim() ||
      !newAddress.kelurahan.trim() ||
      !newAddress.kecamatan.trim() ||
      !newAddress.kabupaten.trim() ||
      !newAddress.provinsi.trim() ||
      !newAddress.detail.trim()
    ) {
      alert("Harap lengkapi semua kolom alamat.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/api/delivery-addresses",
        newAddress,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Alamat berhasil ditambahkan");
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
    }
  };

  const viewInvoice = (orderId) => {
    navigate(`/invoice/${orderId}`);
  };

  const goToEditProfile = (id) => {
    navigate(`/editProfile/${id}`); // Sertakan ID pengguna di URL
  };

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div>
          <h2>Profile</h2>
          <p>Name: {user.full_name}</p>
          <p>Email: {user.email}</p>
          <h4>Tambah alamat baru</h4>
          <label>Nama : </label>
          <input
            type="text"
            placeholder="nama"
            value={newAddress.nama}
            onChange={(e) =>
              setNewAddress({ ...newAddress, nama: e.target.value })
            }
          />
          <label>Kelurahan : </label>
          <input
            type="text"
            placeholder="kelurahan"
            value={newAddress.kelurahan}
            onChange={(e) =>
              setNewAddress({ ...newAddress, kelurahan: e.target.value })
            }
          />
          <label>Kecataman : </label>
          <input
            type="text"
            placeholder="kecamatan"
            value={newAddress.kecamatan}
            onChange={(e) =>
              setNewAddress({ ...newAddress, kecamatan: e.target.value })
            }
          />
          <label>Kabupaten : </label>
          <input
            type="text"
            placeholder="kabupaten"
            value={newAddress.kabupaten}
            onChange={(e) =>
              setNewAddress({ ...newAddress, kabupaten: e.target.value })
            }
          />
          <label>Provinsi : </label>
          <input
            type="text"
            placeholder="Provinsi"
            value={newAddress.provinsi}
            onChange={(e) =>
              setNewAddress({ ...newAddress, provinsi: e.target.value })
            }
          />
          <label>Detail : </label>
          <textarea
            type="text"
            placeholder="detail"
            value={newAddress.detail}
            onChange={(e) =>
              setNewAddress({ ...newAddress, detail: e.target.value })
            }
          />
          <button onClick={addAddress} className="btn btn-secondary  ">
            Tambah alamat
          </button>{" "}
          <button
            onClick={() => goToEditProfile(user._id)}
            className="btn btn-secondary  "
          >
            Edit Profile dan Alamat
          </button>
        </div>

        {/* MY ORDER */}
        <div className="order-box">
          <h3>My Orders</h3>
          <Accordion className="order-head">
            {orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              orders.map((order, index) => {
                return (
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
                        <strong>Nama lengkap:</strong>{" "}
                        {order.delivery_address.nama}
                      </p>
                      <p>
                        <strong>Alamat:</strong>{" "}
                      </p>
                      {order.delivery_address.detail}
                      {","} {order.delivery_address.provinsi}
                      {","} {order.delivery_address.kabupaten}
                      {","} {order.delivery_address.kecamatan}
                      {","} {order.delivery_address.kelurahan}
                      <p>
                        Tanggal pesanan :{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <div className="box-items-header-orders">
                        <p>
                          <strong>Items:</strong>{" "}
                        </p>
                        <div className="items-header-orders">
                          <p>Nama Product</p>
                          <p>Qty</p>
                        </div>
                        <div className="items-products-list">
                          {order.order_items.length > 0 ? (
                            <div className="items-orders-product">
                              {order.order_items.map((item, index) => (
                                <p key={index} className="items-orders-list">
                                  <span>{item.name}</span>
                                  <span>{item.qty} pcs</span>
                                </p>
                              ))}
                            </div>
                          ) : (
                            <p>Tidak ada item dalam pesanan.</p>
                          )}
                        </div>
                      </div>
                      {/* NAVIGATE KE INVOICE */}
                      <button
                        onClick={() => viewInvoice(order._id)}
                        className="btn btn-primary mt-3"
                      >
                        View Invoice
                      </button>
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })
            )}
          </Accordion>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Me;
