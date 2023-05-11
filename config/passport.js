const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const session = require("express-session");
const secret = process.env.SESSION_KEY
const { User } = require('../models');

module.exports = function (app) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      async function (username, password, done) {
        try {
          const user = await User.findOne({ where: { username: username } })
          if (!user) {
            return done(null, false, { message: "Invalid User" });
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalid User" });
          }
        } catch (err) {
          console.log('hello')
          console.error(err);
          return done(null, false, { message: err.toString() });
        }
      }
    )
  );

  app.use(
    session({
      secret: secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
};
