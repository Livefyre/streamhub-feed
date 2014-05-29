require.config({
  paths: {
    jquery: 'lib/jquery/jquery',
    text: 'lib/requirejs-text/text',
    base64: 'lib/base64/base64',
    hogan: 'lib/hogan/web/builds/2.0.0/hogan-2.0.0.amd',
    hgn: 'lib/requirejs-hogan-plugin/hgn',
    jasmine: 'lib/jasmine/lib/jasmine-core/jasmine',
    'jasmine-html': 'lib/jasmine/lib/jasmine-core/jasmine-html',
    'jasmine-jquery': 'lib/jasmine-jquery/lib/jasmine-jquery',
    inherits: 'lib/inherits/inherits',
    'observer': 'lib/observer/src/observer',
    'event-emitter': 'lib/event-emitter/src/event-emitter',
    'debug': 'lib/debug/debug'
  },
  packages: [{
     name: "streamhub-feed",
     location: "src"
  },{
    name: "streamhub-sdk",
    location: "lib/streamhub-sdk/src/"
  },{
    name: "streamhub-sdk/modal",
    location: "lib/streamhub-sdk/src/modal"
  },{
    name: "streamhub-sdk/collection",
    location: 'lib/streamhub-sdk/src/collection'
  },{
    name: "streamhub-sdk/auth",
    location: 'lib/streamhub-sdk/src/auth'
  },{
    name: "streamhub-sdk/content",
    location: 'lib/streamhub-sdk/src/content'
  },{
    name: 'streamhub-sdk-tests',
    location: 'lib/streamhub-sdk/tests/'
  },{
    name: "auth",
    location: "lib/auth/src"
  },{
    name: "livefyre-auth",
    location: "lib/livefyre-auth/src"
  },{
    name: "stream",
    location: "lib/stream/src"
  },{
    name: "thread",
    location: "lib/thread/src"
  },{
    name: "view",
    location: "lib/view/src",
    main: "view"
  },{
    name: "streamhub-editor",
    location: "lib/streamhub-editor/src/javascript",
    main: "editor"
  },{
    name: "streamhub-editor/templates",
    location: "lib/streamhub-editor/src/templates"
  }],
  shim: {
    jquery: {
        exports: '$'
    },
    jasmine: {
        exports: 'jasmine'
    },
    'jasmine-html': {
        deps: ['jasmine'],
        exports: 'jasmine'
    },
    'jasmine-jquery': {
        deps: ['jquery', 'jasmine']
    }
  },
  urlArgs: "_=" +  (new Date()).getTime()
});
