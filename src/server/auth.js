const passport = require("passport");
const express = require("express");
const session = require("express-session");
const { upsertUser } = require("./routes/schema");

const init = app => {
  const oidc = process.config.oidc;

  //app config
  const appconfig = {
    host: process.config.HOST,
    auth: { oidc }
  };

  //define routes
  app.get("/login", passport.authenticate("oidc"));
  app.get(
    "/login/oidc/callback",
    passport.authenticate("oidc", {
      failureRedirect: "/",
      successRedirect: "/profile"
    })
  );
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  //implement the way passportjs serialize and deserialize a user
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  //implement the way passportjs handle oidc login behaviour
  const OIDCStrategy = require("passport-openidconnect").Strategy;
  passport.use(
    "oidc",
    new OIDCStrategy(
      {
        userInfoURL: appconfig.auth.oidc.userInfoUrl,
        authorizationURL: appconfig.auth.oidc.authorizationURL,
        tokenURL: appconfig.auth.oidc.tokenURL,
        clientID: appconfig.auth.oidc.clientId,
        clientSecret: appconfig.auth.oidc.clientSecret,
        issuer: appconfig.auth.oidc.issuer,
        callbackURL: appconfig.host + "/login/oidc/callback"
      },
      (iss, sub, profile, jwtClaims, accessToken, refreshToken, params, cb) => {
        console.log(profile && profile.displayName + " logged in");
        upsertUser({ user_id: profile.id, displayName: profile.displayName });
        return cb(null, profile) || true;
      }
    )
  );

  console.log("auth init");
};

module.exports = init;
