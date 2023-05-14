const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const session = require("express-session");
const secret = process.env.SESSION_SECRET
const { User, sequelize } = require('../models');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

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
          console.error(err);
          return done(null, false, { message: err.toString() });
        }
      }
    )
  );

  const sessionStore = new SequelizeStore({
    db: sequelize,
  });

  sessionStore.sync()

  app.use(
    session({
      secret: secret,
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 60 * 1000 // 30 minutes
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
};
