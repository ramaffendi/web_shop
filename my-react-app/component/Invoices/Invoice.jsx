import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import "./Invoice.css";

const Invoice = () => {
  const { order_id } = useParams();
  console.log("Order ID from URL:", order_id);

  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found");
          return;
        }

        // Menggunakan order_id pada URL endpoint
        const response = await axios.get(
          `${import.meta.env.REACT_APP_API_URL}/api/invoices/${order_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data);
        if (response.data.error) {
          console.error("Error", response.data.error);
        } else {
          setInvoice(response.data);
          console.log("hei", response.data); // Pastikan data invoice diterima dengan benar
        }
      } catch (error) {
        console.error("Error fetching invoice data cuy", error);
      }
    };

    fetchInvoice();
  }, [order_id]);

  if (!invoice) {
    return <div>Loading...</div>;
  }

  return (
    <div className="box-invoice">
      <Navbar />
      <div className="box-content-invoice">
        <h1>Invoice: {invoice._id}</h1>
        <p>
          <strong>Nama Lengkap : </strong>
          {invoice.user?.name || "N/A"}
        </p>
        <p>
          <strong>Pengiriman : </strong>
        </p>
        <p>
          {" "}
          {invoice.delivery_address?.detail || "N/A"}
          {","} {invoice.delivery_address?.kelurahan || "N/A"}
          {","} {invoice.delivery_address?.kecamatan || "N/A"}
          {","} {invoice.delivery_address?.provinsi || "N/A"}
          {","} {invoice.delivery_address?.kabupaten || "N/A"}
        </p>
        <strong>Informasi pembayaran : </strong>
        <ul className="custom-list">
          <li>Bank: {invoice.bank_details.bank_name}</li>
          <li>Nomor Rekening: {invoice.bank_details.account_number}</li>
          <li>Nama Pemilik: {invoice.bank_details.description}</li>
        </ul>
        <strong>Total :</strong> Rp
        {invoice.total?.toLocaleString("id-ID") || "0"}
        <p>
          <span style={{ color: "red" }}>
            Status: {invoice.status || "Unknown"}
          </span>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Invoice;
