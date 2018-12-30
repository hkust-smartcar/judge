const configs = {
  common: {
    oidc: {
      clientId: "<client id>",
      clientSecret: "<client secret",
      issuer: "https://gitlab.hkustracing.com",
      userInfoUrl: "https://gitlab.hkustracing.com/oauth/userinfo",
      authorizationURL: "https://gitlab.hkustracing.com/oauth/authorize",
      tokenURL: "https://gitlab.hkustracing.com/oauth/token",
      emailClaim: "_json.email",
      usernameClaim: "_json.nickname"
    },
    passportSession: {
      name: "passport.sid",
      secret: "my-screte",
      resave: false,
      saveUninitialized: false
    },
    fileLimitSize: 100 //in kb
  },
  dev: {
    MODE: "dev",
    HOST: "http://localhost:8085"
  },
  production: {
    MODE: "production",
    HOST: "https://example.com"
  }
};

module.exports = (key = "production") => ({
  ...configs.common,
  ...configs[key]
});
