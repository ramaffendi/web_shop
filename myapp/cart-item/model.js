const mongoose = require('mongoose')
const { model, Schema } = mongoose

const cartItemSchema = Schema({
    name: {
        type: String,
        minlength: [5, 'panjang nama makanan minimal 5 karakter'],
        required: [true, 'name must be filled']
    },

    qty: {
        type: Number,
        required: [true, 'qty harus diisi'],
        min: [1, 'minimal qty 1']
    },

    price: {
        type: Number,
        default: 0
    },
    image_url: String,

    //dibawah ini adalah relasi nya 

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }

})

module.exports = model('CartItems', cartItemSchema)