import { createContext, useState, useEffect } from "react";
import axios from "axios";

// Membuat konteks untuk keranjang belanja
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [totalItems, setTotalItems] = useState(0);

  // Ambil data cart items dari server
  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(
          `${import.meta.env.REACT_APP_API_URL}/api/carts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  // Simpan perubahan pada cartItems ke localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const itemsCount = cartItems.reduce((total, item) => total + item.qty, 0);
    setTotalItems(itemsCount);
  }, [cartItems]);

  // Fungsi untuk menambahkan item ke keranjang
  const addToCart = async (productId, name, qty = 1) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("silahkan login dulu");
    }

    try {
      const response = await axios.post(
        `${import.meta.env.REACT_APP_API_URL}/api/carts`,
        { name, qty, product: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      //item sudah ada
      setCartItems((prevItems) => {
        const existingItem = prevItems.find(
          (item) => item.product === productId
        );
        //jika ada, update qty
        if (existingItem) {
          const updatedQty = existingItem.qty + qty;
          return prevItems.map((item) =>
            item.product === productId ? { ...item, qty: updatedQty } : item
          );
        }
        return [...prevItems, { ...response.data, qty }]; //tidak ada , maka nambah
      });
    } catch (error) {
      console.error(
        "Error adding to cart:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Fungsi hapusProduct yang diperbarui
  const hapusProduct = async (productId, name, qty = -1) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setCartItems((prevItems) => {
        const existingItem = prevItems.find(
          (item) => item.product === productId
        );
        if (existingItem) {
          const updatedQty = existingItem.qty + qty;

          // Jika kuantitas item <= 0, hapus item dari keranjang
          if (updatedQty <= 0) {
            axios
              .delete(
                `${import.meta.env.REACT_APP_API_URL}/api/carts/${
                  existingItem._id
                }`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              )
              .catch((error) => {
                console.error(
                  "Error deleting from cart:",
                  error.response ? error.response.data : error.message
                );
              });

            return prevItems.filter((item) => item.product !== productId);
          }

          return prevItems.map((item) =>
            item.product === productId ? { ...item, qty: updatedQty } : item
          );
        }
        return prevItems;
      });

      const updatedQty =
        cartItems.find((item) => item.product === productId).qty + qty;
      if (updatedQty > 0) {
        await axios.post(
          `${import.meta.env.REACT_APP_API_URL}/api/carts`,
          { name, qty, product: productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error(
        "Error adding to cart:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Fungsi untuk memperbarui kuantitas item di keranjang
  const updateCartQuantity = async (productId, qtyChange) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const existingItem = cartItems.find((item) => item.product === productId);
      if (existingItem) {
        const newQty = existingItem.qty + qtyChange;
        if (newQty < 0) {
          console.error("Kuantitas tidak bisa kurang dari 0.");
          return;
        }

        if (newQty === 0) {
          await axios.delete(
            `${import.meta.env.REACT_APP_API_URL}/api/carts/${
              existingItem._id
            }`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setCartItems((prev) =>
            prev.filter((item) => item.product !== productId)
          );
        } else {
          await axios.put(
            `${import.meta.env.REACT_APP_API_URL}/api/carts/${
              existingItem._id
            }`,
            { qty: newQty },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setCartItems((prev) =>
            prev.map((item) =>
              item.product === productId ? { ...item, qty: newQty } : item
            )
          );
        }
      }
    } catch (error) {
      console.error(
        "Error updating cart quantity:",
        error.response ? error.response.data : error.message
      );
    }
  };

  //Tags

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        hapusProduct,
        updateCartQuantity,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
