const { subject } = require("@casl/ability");
const Invoice = require("./model");
const { policyFor } = require("../../utils/index");

const show = async (req, res, next) => {
  try {
    let { order_id } = req.params;
    if (!order_id) {
      return res.json({
        error: 1,
        message: "Order ID tidak ditemukan dalam request",
      });
    }
    // Debugging log
    console.log("Received Order ID:", order_id);

    // Cari invoice berdasarkan `order_id`
    let invoice = await Invoice.findOne({ order: order_id })
      .populate("order")
      .populate("user");

    // Debugging log untuk memastikan `invoice` ditemukan atau tidak
    console.log("Fetched Invoice:", invoice);

    // Jika invoice tidak ditemukan
    if (!invoice) {
      return res.json({
        error: 1,
        message: "Invoice tidak ditemukan",
      });
    }

    // Cek policy
    let policy = policyFor(req.user);
    let subjectInvoice = subject("Invoice", {
      ...invoice,
      user_id: invoice.user._id,
    });
    if (!policy.can("read", subjectInvoice)) {
      return res.json({
        error: 1,
        message: "Anda tidak memiliki hak akses untuk melihat invoice ini",
      });
    }

    return res.json(invoice);
  } catch (err) {
    // Debugging lebih rinci dengan error message dan stack trace
    console.error("Detailed Error:", err.message);
    console.error(err.stack);

    return res.json({
      error: 1,
      message:
        "Error ketika ingin mendapatkan invoice: " +
        (err.message || "Unknown error"),
    });
  }
};

module.exports = { show };
