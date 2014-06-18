var inherits = require('inherits');
var ContentView = require('streamhub-sdk/content/views/content-view');
var ContentHeaderView = require('streamhub-sdk/content/views/content-header-view');
var ContentBodyView = require('streamhub-sdk/content/views/content-body-view');
var ContentFooterView = require('streamhub-sdk/content/views/content-footer-view');
var TiledAttachmentListView = require('streamhub-sdk/content/views/tiled-attachment-list-view');
var BlockAttachmentListView = require('streamhub-sdk/content/views/block-attachment-list-view');
var ContentEditorView = require('streamhub-editor/auth-editor');
var feedContentStyles = require('less!streamhub-feed/css/style.less');

'use strict';

var FeedContentView = function (opts) {
    opts = opts || {};

    ContentView.call(this, opts);
};
inherits(FeedContentView, ContentView);

FeedContentView.prototype.events = ContentView.prototype.events.extended({
    'click': function (e) {
        if ($(e.target).hasClass('hub-content-reply')) {
            this.toggleReplies();
        }
    },
    'writeContent.hub': function (e) {
        this.toggleReplies(false);
    }
});

FeedContentView.prototype.toggleReplies = function (show) {
    this._editorView.$el.toggle(show);
};

FeedContentView.prototype._addInitialChildViews = function (opts) {
    opts = opts || {};

    this._tiledAttachmentListView = new TiledAttachmentListView(opts);
    this.add(this._tiledAttachmentListView, { render: false });

    this._headerView = opts.headerView || this._headerViewFactory.createHeaderView(opts.content);
    this.add(this._headerView, { render: false });

    this._blockAttachmentListView = new BlockAttachmentListView(opts);
    this.add(this._blockAttachmentListView, { render: false });

    this._bodyView = new ContentBodyView(opts);
    this.add(this._bodyView, { render: false });

    this._footerView = new ContentFooterView(opts);
    this.add(this._footerView, { render: false });

    this._editorView = new ContentEditorView({
        collection: opts.content.collection,
        contentParentId: opts.content.id        
    });
    this.add(this._editorView, { render: false });
};

module.exports = FeedContentView;
