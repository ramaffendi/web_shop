import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS toastify
import "./ContactUs.css";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

const ContactUs = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false); // State untuk loading

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true); // Set tombol menjadi disabled

    try {
      await emailjs.sendForm(
        "service_sj8qanl",
        "template_dd68k2h",
        form.current,
        { publicKey: "R7X3wcEo0vY5aGZKV" }
      );
      toast.success("Message sent successfully! ✅"); // Notifikasi sukses
      form.current.reset(); // Reset form setelah terkirim
    } catch (error) {
      console.error("FAILED...", error.text);
      toast.error("Failed to send message. Please try again. ❌"); // Notifikasi error
    } finally {
      setLoading(false); // Kembalikan tombol ke normal
    }
  };

  return (
    <>
      <Navbar />
      <div className="contact-us">
        <div className="section-left">
          <div className="location">
            <h3>Location</h3>
            <p>Jl. Sudirman Mampang, Bekasi selatan, Desa Konoha</p>
            <p>17510</p>
          </div>
          <div className="follow-us">
            <h3>Follow Us</h3>
            <ul>
              <li>
                <a href="#">
                  <i className="fab fa-facebook-f" />
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fab fa-twitter" />
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fab fa-instagram" />
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fab fa-google-plus-g" />
                </a>
              </li>
            </ul>
            <p>©2025 Privacy policy</p>
          </div>
        </div>
        <div className="section-right">
          <div className="box-email">
            <form ref={form} onSubmit={sendEmail} className="form-input1">
              <label>Name</label>
              <input type="text" name="user_name" required />
              <label>Email</label>
              <input type="email" name="user_email" required />
              <label>Message</label>
              <textarea name="message" required />
              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
