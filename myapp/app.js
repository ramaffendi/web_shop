var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const { decodeToken } = require("./middleware/index");
const productRoute = require("./app/product/router");
const categoryRoute = require("./app/category/routes");
const tagRoute = require("./app/tag/router");
const authRoute = require("./app/auth/router");
const DeliveryAddressRoute = require("./app/DeliveryAddress/router");
const cartControllerRoute = require("./app/cart/router");
const orderControllerRoute = require("./app/order/router");
const InvoiceControllerRoute = require("./app/invoice/router");
const passport = require("passport");

require("dotenv").config();
console.log("MONGO_URI:", process.env.MONGO_URI);
const session = require("express-session");
var app = express();

// Cek apakah MONGO_URI tersedia
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI tidak ditemukan di .env file.");
  process.exit(1);
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Tempatkan session sebelum passport
app.use(
  session({
    secret: process.env.JWT_SECRET, // Gantilah dengan secret yang lebih aman
    resave: false,
    saveUninitialized: false,
  })
);

// Inisialisasi passport dan session
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.session()); // Aktifkan session untuk Passport

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(
  cors({
    origin: "http://localhost:5173", // Sesuaikan dengan URL React
    credentials: true, // Izinkan pengiriman cookies / authorization header
    allowedHeaders: ["Content-Type", "Authorization"], // Tambahkan Authorization
    methods: ["GET", "POST", "PUT", "DELETE"], // Metode yang diizinkan
  })
);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static("public/images/products"));
app.use(decodeToken());

app.use("/auth", authRoute);
app.use("/api", productRoute);
app.use("/api", categoryRoute);
app.use("/api", tagRoute);
app.use("/api", DeliveryAddressRoute);
app.use("/api", cartControllerRoute);
app.use("/api", orderControllerRoute);
app.use("/api", InvoiceControllerRoute);

//home
app.use("/", (req, res) => {
  res.send("Welcome to the app!"); // Atau bisa mengarah ke route yang sesuai
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
