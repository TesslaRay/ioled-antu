const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { googleClientID } = require("../config/env");
const { googleClientSecret } = require("../config/env");

const { getUser, saveUser } = require("./firestore");

/**
 * Determines which data of the user object is stored in the session.
 * If authentication succeeds, a session will be established and maintained
 * via a cookie set in the user's browser. In order to support login sessions,
 * Passport will serialize and deserialize user instances to and from the session.
 * @param user The authenticated user object.
 * @param done The callback function used by passport.
 */
passport.serializeUser((user, done) => {
  done(null, user.googleID);
});

passport.deserializeUser(async (id, done) => {
  const user = await getUser(id);
  done(null, user);
});

// Tell passport to use the google strategy for oath.
passport.use(
  /**
   * Create a google strategy.
   * @param clientID Public token. It identifies the app to google servers.
   * @param clientSecret Private token to comunicate to the app.
   * @param callbackURL Url to redirect after authentication.
   */
  new GoogleStrategy(
    {
      clientID: googleClientID,
      clientSecret: googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      // Destructure profile values.
      const {
        id: googleID,
        name: { familyName: lastName, givenName: name },
        emails: [{ value: email }],
        photos: [{ value: photo }],
      } = profile;

      // Search in the DB for the user.
      // const existingUser = await User.users.findOne({googleID});
      const existingUser = await getUser(googleID);
      console.log(existingUser);
      // If the user exists, call passport done with the user.
      if (existingUser !== null) {
        return done(null, existingUser.user);
      }

      // If the user doesn't exist, then create a new user and call done with it.
      const newUser = await saveUser({
        googleID,
        name,
        lastName,
        email,
        photo,
      });

      done(null, newUser);
    }
  )
);
