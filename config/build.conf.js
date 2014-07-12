({
  mainConfigFile: '../config/requirejs.conf.js',
  paths: {
    jquery: 'lib/jquery/jquery.min',
    almond: 'lib/almond/almond',
    auth: 'lib/streamhub-sdk/tools/auth-stub'
  },
  baseUrl: '..',
  name: "streamhub-feed",
  include: [
    'almond',
    'streamhub-feed/content-view',
    'css'
  ],
  exclude: ['css/normalize', 'less/normalize'],
  stubModules: ['text', 'hgn', 'json'],
  out: "../dist/streamhub-feed.min.js",
  buildCSS: true,
  separateCSS: true,
  pragmasOnSave: {
    excludeHogan: true,
    excludeRequireCss: true
  },
  cjsTranslate: true,
  optimize: "uglify2",
  preserveLicenseComments: false,
  uglify2: {
    compress: {
      unsafe: true
    },
    mangle: true
  },
  wrap: {
    startFile: 'wrap-start.frag',
    endFile: 'wrap-end.frag'
  },
  generateSourceMaps: true,
  onBuildRead: function(moduleName, path, contents) {
    switch (moduleName) {
      case "jquery":
        contents = "define([], function(require, exports, module) {" + contents + "});";
    }
    return contents;
  }
})
