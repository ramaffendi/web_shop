const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../user/model");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { getToken } = require("../../utils/index");
const nodemailer = require("nodemailer");

require("dotenv").config();

const register = async (req, res, next) => {
  try {
    const payload = req.body;
    let user = new User(payload);
    await user.save();

    return res.status(201).json(user);
  } catch (err) {
    // cek kemungkinan kesalahan validasi
    if (err && err.name === "ValidationError") {
      return res.status(400).json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const localStrategy = async (email, password, done) => {
  try {
    let user = await User.findOne({ email }).select(
      "-__v -createdAt -updatedAt -cart_items -token"
    );
    if (!user) return done(null, false); // Pengguna tidak ditemukan
    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false); // Password salah
    }
    ({ password, ...userWithoutPassword } = user.toJSON()); // agar password tidak ikut terkirim ke API client
    return done(null, userWithoutPassword);
  } catch (err) {
    done(err, null);
  }
};

const login = async (req, res, next) => {
  passport.authenticate("local", async function (err, user) {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        status: false,
        error: 1,
        message: "Email atau password salah",
      });
    }

    const token = jwt.sign(user, config.secretKey);
    await User.findByIdAndUpdate(user._id, { $push: { token: token } });

    return res.status(200).json({
      status: true, // Menambahkan status sukses
      message: "Login berhasil",
      user,
      token: token,
    });
  })(req, res, next);
};

const logout = async (req, res, next) => {
  let token = getToken(req);
  if (!token) {
    return res.status(401).json({
      error: 1,
      message: "No token provided!",
    });
  }

  let user = await User.findOneAndUpdate(
    { token: { $in: [token] } },
    { $pull: { token: token } }
  );
  if (!user) {
    return res.status(404).json({
      error: 1,
      message: "No user found!",
    });
  }

  return res.json({
    error: 1,
    message: "Logout berhasil",
  });
};

const me = (req, res, next) => {
  console.log(req.user);
  if (!req.user) {
    return res.status(401).json({
      error: 1,
      message: "Token expired atau tidak valid",
    });
  }

  return res.json(req.user);
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not registered" });
    }

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      text: `http://localhost:5173/reset-password/${resetToken}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error sending email:", error);
        return res.status(500).json({ message: "Error sending email" });
      } else {
        return res.status(200).json({
          status: "success",
          message: "Check your email for the reset link",
        });
      }
    });
  } catch (err) {
    console.log("Error at forgotPassword:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.userId;

    const hashingPw = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(id, { password: hashingPw });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ status: false, message: "User not found" });
    }

    console.log("Password updated successfully for user", id);
    return res
      .status(200)
      .json({ status: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Error during reset password:", err);
    return res.status(400).json({ status: false, message: "Invalid token" });
  }
};

const updateUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const { full_name, email } = req.body;

    // Validasi ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: "error",
        message: "Format ID tidak valid",
      });
    }

    // Siapkan data update
    const updateData = {};
    if (full_name) updateData.full_name = full_name;
    if (email) updateData.email = email;

    // Update user menggunakan mongoose
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true } // Ini akan mengembalikan dokumen yang sudah diupdate
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User tidak ditemukan",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Profil berhasil diperbarui",
      data: updatedUser,
    });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
    });
  }
};

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Hanya memperbarui password tanpa memicu validasi ulang
    await User.findByIdAndUpdate(
      id,
      { $set: { password: hashedPassword } },
      { new: true }
    );

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  register,
  localStrategy,
  login,
  logout,
  me,
  forgotPassword,
  resetPassword,
  updateUserId,
  updatePassword,
};
