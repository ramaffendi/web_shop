import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import { useCart } from "../ShopContext/UseCartContext";
import axios from "axios";
import "./Cart.css";
import swal from "sweetalert";

const Cart = () => {
  const {
    cartItems,
    updateCartQuantity,
    addToCart,
    setCartItems,
    hapusProduct,
  } = useCart();

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Ambil data keranjang dari backend saat komponen di-mount
  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Arahkan ke halaman login
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.REACT_APP_API_URL}/api/carts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Cart items berhasil:", response.data);
        setCartItems(response.data); // Menyimpan data dari backend ke state
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [setCartItems, navigate]);

  const totalPrice = Object.entries(cartItems).reduce(
    (acc, [, item]) => acc + (item.qty || 0) * (item.price || 0),
    0
  );

  const handleCheckout = () => {
    if (Object.keys(cartItems).length === 0) {
      swal(
        "",
        "Keranjang Anda kosong! Silakan tambahkan item sebelum melanjutkan ke checkout.",
        "error"
      );
      return;
    }

    navigate("/deliveryAddress", { state: { cartItems } });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <div className="cart-items">
          <div className="cart-title">
            <p>Items</p>
            <p>Quantity</p>
            <p>Price</p>
            <p>Hapus</p>
          </div>
          <hr />
          {Object.keys(cartItems).length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="cart-item-list">
              {Object.entries(cartItems).map(([id, cartItem]) => (
                <div key={id} className="cart-item">
                  {cartItem.image_url && (
                    <img
                      src={`${
                        import.meta.env.REACT_APP_API_URL
                      }/images/products/${cartItem.image_url}`}
                      alt={cartItem.name}
                    />
                  )}
                  <div className="quantity-control">
                    <button
                      onClick={() => hapusProduct(cartItem.product)}
                      className="btn btn-primary"
                    >
                      -
                    </button>
                    <p className="quantity">{cartItem.qty}</p>
                    {/* Ini akan otomatis ter-update */}
                    <button
                      onClick={() => addToCart(cartItem.product)}
                      className="btn btn-primary"
                    >
                      +
                    </button>
                  </div>
                  <p>Rp {cartItem.price.toLocaleString("id-ID")}</p>
                  <button
                    onClick={() =>
                      updateCartQuantity(cartItem.product, -cartItem.qty)
                    }
                    className="btn btn-danger"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="cart-total-belanja">
          <h2>Total: Rp {totalPrice.toLocaleString("id-ID")}</h2>
        </div>

        <button onClick={handleCheckout} className="btn btn-primary ">
          Checkout
        </button>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
