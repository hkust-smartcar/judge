const passport = require('passport')
const express = require('express')
const session = require('express-session')

const init = app => {

  const oidc = process.config.oidc
  
  //app config
  const appconfig = {
    host: process.config.HOST,
    auth: {oidc}
  }
  
  //define routes
  app.get('/login',passport.authenticate('oidc'))
  app.get('/login/oidc/callback', passport.authenticate('oidc', { failureRedirect: '/b', successRedirect: '/b' }))
  app.get('/b',(req,res)=>{
    if(!req.session.passport)res.redirect('/login')
    console.log(req.session)
    return res.send(req.session.passport.user.displayName)
  })
  
  //implement the way passportjs serialize and deserialize a user
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  
  //implement the way passportjs handle oidc login behaviour
  const OIDCStrategy = require('passport-openidconnect').Strategy
  passport.use('oidc', new OIDCStrategy({
      userInfoURL: appconfig.auth.oidc.userInfoUrl,
      authorizationURL: appconfig.auth.oidc.authorizationURL,
      tokenURL: appconfig.auth.oidc.tokenURL,
      clientID: appconfig.auth.oidc.clientId,
      clientSecret: appconfig.auth.oidc.clientSecret,
      issuer: appconfig.auth.oidc.issuer,
      callbackURL: appconfig.host + '/login/oidc/callback'
  }, (iss, sub, profile, jwtClaims, accessToken, refreshToken, params, cb) => {
      console.log(profile)
      return cb(null, profile) || true
  }))
  
  console.log('hello world')
}

module.exports = init

// const router = express.Router()

// router.get('/',passport.authenticate('oidc'))
// router.get('/oidc/callback', passport.authenticate('oidc', { failureRedirect: '/', successRedirect: '/dat' }))
// router.get('/data',(req,res)=>res.send(req.session))
// // router.get('/',(req,res)=>{
// //   if(!req.session.passport)res.redirect('/login')
// //   console.log(req.session)
// //   return res.send(req.session.passport.user.displayName)
// // })

// //implement the way passportjs serialize and deserialize a user
// passport.serializeUser(function(user, done) {
//   done(null, user);
// });
// passport.deserializeUser(function(user, done) {
//   done(null, user);
// });

// //implement the way passportjs handle oidc login behaviour
// console.log(process.config.HOST + '/login/oidc/callback')
// const OIDCStrategy = require('passport-openidconnect').Strategy
// passport.use('oidc', new OIDCStrategy({
//   ...process.config.oidc,
//   callbackURL: process.config.HOST + '/login/oidc/callback'
// }, (iss, sub, profile, jwtClaims, accessToken, refreshToken, params, cb) => {
//   console.log('login success')
//   console.log(profile)
//   return cb(null, profile) || true
// }))

// module.exports = router
