const Product = require("../product/model");
const CartItem = require("../../cart-item/model"); // Pastikan model CartItem sudah benar

const update = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid data format" });
    }
    const productIds = items.map((item) => item.product._id);
    const products = await Product.find({ _id: { $in: productIds } });

    // Membuat item keranjang berdasarkan produk yang ditemukan
    let cartItems = items.map((item) => {
      let relatedProduct = products.find(
        (product) => product._id.toString() === item.product._id
      );
      return {
        product: relatedProduct._id,
        price: relatedProduct.price,
        image_url: relatedProduct.image_url,
        name: relatedProduct.name,
        user: req.user._id,
        qty: item.qty,
      };
    });

    console.log("Cart items to be added:", cartItems);

    // Update keranjang pengguna
    await CartItem.bulkWrite(
      cartItems.map((item) => {
        return {
          updateOne: {
            filter: {
              user: req.user._id,
              product: item.product,
            },
            update: { $set: item },
            upsert: true, // Buat item baru jika tidak ada
          },
        };
      })
    );

    return res.json(cartItems);
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const index = async (req, res, next) => {
  try {
    // Periksa apakah pengguna ada
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: "User tidak ditemukan. Silakan login kembali.",
      });
    }

    console.log("Fetching cart items for user:", req.user._id);

    // Ambil item keranjang untuk pengguna
    const items = await CartItem.find({ user: req.user._id })
      .populate("product")
      .populate("user");

    // console.log('Cart items found:', items);

    // Kembalikan item keranjang atau array kosong
    return res.status(200).json(items);
  } catch (err) {
    console.error("Error fetching cart items:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: true,
        message: err.message,
        fields: err.errors,
      });
    }

    return res.status(500).json({
      error: true,
      message: "Terjadi kesalahan saat mengambil item keranjang.",
    });
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { qty, product } = req.body;

    // Validasi payload
    if (!qty || !product) {
      return res
        .status(400)
        .json({ error: true, message: "Semua field harus diisi." });
    }

    // Cari produk berdasarkan ID produk
    const foundProduct = await Product.findById(product);
    if (!foundProduct) {
      return res
        .status(404)
        .json({ error: true, message: "Produk tidak ditemukan." });
    }

    // Cek apakah item sudah ada di keranjang
    let existingCartItem = await CartItem.findOne({
      user: req.user._id,
      product: foundProduct._id,
    });

    if (existingCartItem) {
      // Update kuantitas jika item sudah ada
      existingCartItem.qty += qty;
      await existingCartItem.save();
      console.log("Cart item updated:", existingCartItem);
      return res.json(existingCartItem);
    } else {
      // Buat item baru di keranjang
      let payload = {
        name: foundProduct.name,
        qty,
        user: req.user._id,
        product: foundProduct._id,
        price: foundProduct.price,
        image_url: foundProduct.image_url,
      };

      let cartItem = new CartItem(payload);
      await cartItem.save();
      console.log("Cart item saved:", cartItem);

      return res.json(cartItem);
    }
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const hapusProduct = async (req, res, next) => {
  try {
    const { qty } = req.body;
    const productId = req.params.id; // Ambil ID produk dari URL

    // Cari item keranjang untuk user dan produk yang dimaksud
    let existingCartItem = await CartItem.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingCartItem) {
      // Kurangi qty, lalu simpan ke database
      existingCartItem.qty -= qty;

      if (existingCartItem.qty <= 0) {
        // Jika kuantitas <= 0, hapus item dari keranjang
        await existingCartItem.remove();
        return res.json({ message: "Item dihapus dari keranjang" });
      } else {
        // Simpan perubahan kuantitas di database
        await existingCartItem.save();
        return res.json(existingCartItem);
      }
    } else {
      // Jika item tidak ditemukan
      return res
        .status(404)
        .json({ error: true, message: "Item tidak ditemukan di keranjang" });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const deleteFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await CartItem.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item tidak ditemukan" });
    }

    res.json({ message: "Item berhasil dihapus", deletedItem });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Terjadi kesalahan saat menghapus item",
        error: error.message,
      });
  }
};

const updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { qty } = req.body;

  try {
    const updatedItem = await CartItem.findByIdAndUpdate(
      id,
      { qty },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item tidak ditemukan" });
    }

    res.json({ message: "Item berhasil diperbarui", updatedItem });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Terjadi kesalahan saat memperbarui item",
        error: error.message,
      });
  }
};

module.exports = {
  update,
  index,
  addToCart,
  deleteFromCart,
  hapusProduct,
  updateCartItem,
};
