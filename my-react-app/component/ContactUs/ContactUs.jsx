import { useRef } from "react";
import emailjs from "@emailjs/browser";
import "./ContactUs.css";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

const ContactUs = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_sj8qanl", "template_dd68k2h", form.current, {
        publicKey: "R7X3wcEo0vY5aGZKV",
      })
      .then(
        () => {
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };

  return (
    <>
      <Navbar />
      <div className="box-email">
        <form ref={form} onSubmit={sendEmail} className="form-input1">
          <label>Name</label>
          <input type="text" name="user_name" />
          <label>Email</label>
          <input type="email" name="user_email" />
          <label>Message</label>
          <textarea name="message" />
          <input type="submit" value="Send" />
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
