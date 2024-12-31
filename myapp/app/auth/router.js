const router = require("express").Router();
const autoController = require("./controller");
const passport = require("passport");
const { authenticateJWT } = require("../../middleware/index");
const localStrategy = require("passport-local").Strategy;

passport.use(
  new localStrategy({ usernameField: "email" }, autoController.localStrategy)
);
router.post("/signup", autoController.register);
router.post("/login", autoController.login);
router.post("/logout", autoController.logout);
router.post("/forgot-password", autoController.forgotPassword);
router.post("/reset-password/:token", autoController.resetPassword);
router.get("/me", autoController.me);
router.put("/updateProfile/:id", authenticateJWT, autoController.updateUserId);
router.put(
  "/updatePassword/:id",
  authenticateJWT,
  autoController.updatePassword
);

module.exports = router;
