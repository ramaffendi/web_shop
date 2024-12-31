const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const invoiceSchema = Schema(
  {
    sub_total: {
      type: Number,
      required: [true, "sub_total harus diisi"],
    },

    delivery_fee: {
      type: Number,
      required: [true, "delivery_fee harus diisi"],
    },

    delivery_address: {
      provinsi: { type: String, require: [true, "provinsi harus diisi"] },
      kabupaten: { type: String, require: [true, "kabupaten harus diisi"] },
      kecamatan: { type: String, require: [true, "kecamatan harus diisi"] },
      kelurahan: { type: String, require: [true, "kelurahan harus diisi"] },
      detail: { type: String },
    },
    bank_details: {
      bank_name: { type: String, required: [true, "nama harus diisi"] },
      account_number: {
        type: Number,
        required: [true, "provinsi harus diisi"],
      },
      description: { type: String, required: [true, "kabupaten harus diisi"] },
      branch: { type: String, required: [true, "kecamatan harus diisi"] },
    },
    total: {
      type: Number,
      required: [true, "total harus diisi"],
    },
    payment_method: {
      type: String,
      enum: ["bank_transfer", "virtual_account"],
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    order: {
      type: Schema.Types.ObjectId,
    },
    status: {
      type: String,
      enum: ["waiting_payment", "processing", "in_delivery", "delivered"],
      default: "waiting_payment",
    },
  },
  { timesStamps: true }
);

module.exports = model("Invoice", invoiceSchema);
