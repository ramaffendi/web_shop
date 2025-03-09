const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../user/model");

require("dotenv").config();
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let existingUser = await User.findOne({
          email: profile.emails[0].value,
        });

        if (!existingUser) {
          existingUser = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
          });
          await existingUser.save();
          console.log("User created:", existingUser);
        }

        // Membuat JWT setelah login berhasil
        const token = jwt.sign(
          { id: existingUser._id, email: existingUser.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        // Mengirimkan token ke frontend
        return done(null, { user: existingUser, token: token });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Serialize dan deserialize user untuk session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
