const configs = {
  dev: {
    MODE: 'dev'
  },
  production: {
    MODE: 'production'
  }
}

module.exports = (key = 'production') => configs[key]
