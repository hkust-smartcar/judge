const configs = {
  common: {

  },
  dev: {
    MODE: 'dev'
  },
  production: {
    MODE: 'production'
  }
}

module.exports = (key = 'production') => ({...configs.common,...configs[key]})
