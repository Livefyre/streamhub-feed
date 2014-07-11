var $ = require('streamhub-sdk/jquery');
var inherits = require('inherits');
var FeedView = require('streamhub-feed/feed-view');
var Passthrough = require('stream/passthrough');

'use strict';

var FeedComponent = function (opts) {
    Passthrough.call(this);

    this._feedView = new FeedView(opts);

    this.pipe(this._feedView);
    this.more = new Passthrough();
    this.more.pipe(this._feedView.more);
    if (opts.collection) {
        opts.collection.pipe(this);
    }
};
inherits(FeedComponent, Passthrough);

module.exports = FeedComponent;

module.exports.FeedView = FeedView;
