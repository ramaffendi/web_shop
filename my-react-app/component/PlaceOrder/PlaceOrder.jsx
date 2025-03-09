import { useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import NavbarComponent from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PlaceOrder.css";
import bankDetails from "../../src/data/pembayaran";
import swal from "sweetalert";
import Swal from "sweetalert2";
import { DotLottieWorkerReact } from "@lottiefiles/dotlottie-react";

import ReactDOM from "react-dom";
const PlaceOrder = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const deliveryFee = 4000;
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCartItems);

    const calculateTotals = () => {
      const calculatedSubtotal = storedCartItems.reduce(
        (acc, item) => acc + item.qty * item.price,
        0
      );
      setSubtotal(calculatedSubtotal);
      setTotal(calculatedSubtotal + deliveryFee);
    };

    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.REACT_APP_API_URL}/api/delivery-addresses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAddresses(response.data.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    if (storedCartItems.length > 0) {
      calculateTotals();
    }
    fetchAddresses();
  }, []);

  const handleAddressChange = (e) => {
    const addressId = e.target.value;
    const selectedAddr = addresses.find((addr) => addr._id === addressId);
    setSelectedAddress(selectedAddr);
  };

  const handlePaymentChange = (e) => {
    setSelectedPayment(e.target.value);
  };

  const getPaymentDetails = () => {
    if (selectedPayment === "bca") {
      return {
        type: "bank_transfer",
        details: bankDetails.bank_transfer.bca,
      };
    } else if (selectedPayment === "mandiri_va") {
      return {
        type: "virtual_account",
        details: bankDetails.virtual_account.mandiri_va,
      };
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAddress) {
      swal("Alamat belum dipilih");
      return;
    }

    if (!selectedPayment) {
      swal("Metode pembayaran belum dipilih");
      return;
    }

    const paymentDetails = getPaymentDetails();

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.REACT_APP_API_URL}/api/orders`,
        {
          delivery_fee: deliveryFee,
          delivery_address: selectedAddress,
          items: cartItems,
          payment_method: paymentDetails.type,
          bank_details: paymentDetails.details,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const orderId = response.data._id;
      if (!orderId) {
        swal("Terjadi kesalahan, ID pesanan tidak ditemukan.");
        return;
      }

      localStorage.removeItem("cartItems");

      // Menampilkan SweetAlert2 dengan animasi Lottie
      Swal.fire({
        title: "Pembelian Berhasil!",
        html: `
        <div style="text-align: center;">
          <div id="lottie-container" style="width: 150px; height: 150px; margin: auto;"></div>
          <p>Pesanan Anda telah diproses dengan sukses!</p>
        </div>
      `,
        didOpen: () => {
          // Render DotLottie inside the Swal modal
          const container = document.getElementById("lottie-container");
          ReactDOM.createRoot(container).render(
            <DotLottieWorkerReact
              src="https://lottie.host/336b57a1-ffd2-4dc6-a508-7f8f86b9557c/nMpchfJ7Th.lottie"
              loop
              autoplay
              style={{ width: "100%", height: "100%" }}
            />
          );
        },
        confirmButtonText: "OK",
      });

      // Redirect ke halaman invoice
      navigate(`/invoice/${orderId}`);
    } catch (error) {
      console.error(
        "Error placing order:",
        error.response ? error.response.data : error.message
      );
      swal("Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.");
    }
  };

  const renderPaymentSection = () => {
    const paymentDetails = selectedPayment ? getPaymentDetails() : null;

    return (
      <div className="payment-section">
        <div>
          <label>Pilih Metode Pembayaran:</label>
          <select
            onChange={handlePaymentChange}
            value={selectedPayment}
            className="form-select"
          >
            <option>Pilih metode pembayaran</option>
            <option value="bca">Transfer Bank BCA</option>
            <option value="mandiri_va">Virtual Account Mandiri</option>
          </select>
        </div>

        {paymentDetails && (
          <div className="bank-details">
            <h4>Detail Pembayaran:</h4>
            <p>
              <strong>Bank:</strong> {paymentDetails.details.bank_name}
              <img
                src={paymentDetails.details.logo}
                alt={paymentDetails.details.bank_name}
                width="80"
                height="35"
                style={{
                  marginLeft: "29px",
                  borderRadius: "5px",
                  paddingBottom: "5px",
                }}
              />
            </p>
            <p>
              <strong>No. Rekening:</strong>{" "}
              {paymentDetails.details.account_number}
            </p>
            <p>
              <strong>Keterangan:</strong> {paymentDetails.details.description}
            </p>
            <p>
              <strong>Cabang:</strong> {paymentDetails.details.branch}
            </p>
          </div>
        )}
      </div>
    );
  };

  const newAddress = () => {
    navigate("/me"); // Ganti "/tambah-alamat" dengan route tujuan
  };

  return (
    <>
      <NavbarComponent />
      <form className="place-order" onSubmit={handleSubmit}>
        <div className="place-order-left">
          <div className="box-delivery">
            <p className="title">Informasi Pengiriman</p>
            <h3>Pilih Alamat Pengiriman</h3>
            <select
              onChange={handleAddressChange}
              value={selectedAddress ? selectedAddress._id : ""}
              className="form-select"
            >
              <option value="">Pilih alamat</option>
              {addresses.map((addr) => (
                <option key={addr._id} value={addr._id}>
                  {addr.nama}, {addr.kelurahan}, {addr.kecamatan},{" "}
                  {addr.kabupaten}, {addr.provinsi}
                </option>
              ))}
            </select>
          </div>

          {selectedAddress && (
            <div className="box-address">
              <div className="address-details">
                <h3 className="address-details-judul">Alamat yang Dipilih:</h3>
                <p>
                  <strong>Nama lengkap:</strong> {selectedAddress.nama}
                </p>
                <p>
                  <strong>Alamat lengkap:</strong> {selectedAddress.detail}
                </p>
                <p>
                  {selectedAddress.kelurahan}, {selectedAddress.kecamatan},{" "}
                  {selectedAddress.kabupaten}, {selectedAddress.provinsi}
                </p>
              </div>
            </div>
          )}

          <div className="box-cartitems-head">
            <h3>Item Keranjang</h3>
            {cartItems.length > 0 ? (
              <div className="cart-items-list-product">
                <div className="cart-items-header">
                  <p>Nama Product</p>
                  <p>Qty</p>
                  <p>Harga</p>
                </div>
                <div className="cart-item-product-header">
                  {cartItems.map((item, index) => (
                    <div key={index} className="cart-item-product">
                      <div className="products-items">
                        <p>{item.name}</p>
                        <p>{item.qty} pcs</p>
                        <p>
                          Rp {(item.price * item.qty).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))}
                  <p>
                    <strong>
                      Sub total: Rp {subtotal.toLocaleString("id-ID")}
                    </strong>
                  </p>
                </div>
              </div>
            ) : (
              <p>Tidak ada item di keranjang.</p>
            )}
          </div>
          <div className="button-box-adress">
            <button className="button-newAddress" onClick={newAddress}>
              Tambah Alamat
            </button>
          </div>
        </div>

        <div className="place-order-right">
          <div className="cart-total">
            <h2>Checkout</h2>
            {renderPaymentSection()}
          </div>

          <div className="cart-total">
            <h2>Total Keranjang</h2>
            <div>
              <div className="cart-total-detail">
                <p>Sub Total</p>
                <p>Rp {subtotal.toLocaleString("id-ID")}</p>
              </div>
              <hr />
              <div className="cart-total-detail">
                <p>Biaya Pengiriman</p>
                <p>Rp {deliveryFee.toLocaleString("id-ID")}</p>
              </div>
              <hr />
              <div className="cart-total-detail">
                <b>Total Semua</b>
                <b>Rp {total.toLocaleString("id-ID")}</b>
              </div>
            </div>
            <button type="submit" className="button-submit">
              CHECK OUT
            </button>
          </div>
        </div>
      </form>
      <Footer />
    </>
  );
};

export default PlaceOrder;
