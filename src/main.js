'use strict';

var inherits = require('inherits');
var ListView = require('streamhub-sdk/views/list-view');
var ContentThreadView = require('thread');
var FeedContentViewFactory = require('streamhub-feed/content-view-factory');

var FeedView = function (opts) {
    opts = opts || {};
    ListView.call(this, opts);
};
inherits(FeedView, ListView);

FeedView.prototype.themeClass = 'content-feed';

FeedView.prototype.add = function (content) {
    var contentView = this._createContentView(content);
    ListView.prototype.add.call(this, contentView);
};

FeedView.prototype._createContentView = function (content) {
    return new ContentThreadView({
        content: content,
        rootContentViewFactory: new FeedContentViewFactory()
    });
};

module.exports = FeedView;
