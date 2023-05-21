import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Configure the local strategy for Passport
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });

      if (!user) {
        return done(null, false, { message: "Invalid username or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return done(null, false, { message: "Invalid username or password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Serialize and deserialize user instances to maintain user sessions
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
