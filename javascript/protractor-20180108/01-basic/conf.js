var isLongTimeoutMode = process.argv.find(function(v){ return (v == "--long-timeout") });

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',

  suites: {
    calculator: ['spec/calculator/**/*.js'],
    google: ['spec/google/**/*.js']
  },

  exclude: [],

  jasmineNodeOpts: {
    defaultTimeoutInterval: (isLongTimeoutMode)? 10 * 60 * 1000 : 60 * 1000  // 10.min or 1.min
  }
};
