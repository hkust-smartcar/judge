const webpack = require('webpack')

const configs = {
  dev: {
    MODE: 'dev'
  },
  production: {
    MODE: 'production'
  }
}

module.exports = (key = 'production') => new webpack.DefinePlugin({
  "process.config": JSON.stringify(configs[key])
})