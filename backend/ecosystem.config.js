module.exports = {
    apps : [{
      name   : "Reservoir",
      script : "./app.js",
      merge_logs: true,
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      }
    }]
  }