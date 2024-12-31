const router = require('express').Router();
const { policeCheck, authenticateJWT } = require('../../middleware/index');
const cartController = require('./controller');

// Route untuk mendapatkan item keranjang
router.get('/carts', authenticateJWT, policeCheck('read', 'CartItems'), cartController.index);

// Route untuk memperbarui item keranjang
router.put('/carts', authenticateJWT, policeCheck('update', 'CartItems'), cartController.updateCartItem);

// Route untuk menambahkan item ke keranjang
router.post('/carts', authenticateJWT, policeCheck('create', 'CartItems'), cartController.addToCart);
router.patch('/carts/:id', authenticateJWT, policeCheck('update', 'CartItems'), cartController.hapusProduct);

// Route untuk menghapus item dari keranjang
router.delete('/carts/:id', authenticateJWT, policeCheck('delete', 'CartItems'), cartController.deleteFromCart);

module.exports = router;

