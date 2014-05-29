var inherits = require('inherits');
var ContentView = require('streamhub-sdk/content/views/content-view')
var ContentHeaderView = require('streamhub-sdk/content/views/content-header-view');
var ContentBodyView = require('streamhub-sdk/content/views/content-body-view');
var ContentFooterView = require('streamhub-sdk/content/views/content-footer-view');
var TiledAttachmentListView = require('streamhub-sdk/content/views/tiled-attachment-list-view');
var BlockAttachmentListView = require('streamhub-sdk/content/views/block-attachment-list-view');
var ContentEditorView = require('streamhub-sdk/content/views/content-editor-view');

'use strict';

var FeedContentView = function (opts) {
    opts = opts || {};
    opts.themeClass = 'content-feed';

    ContentView.call(this, opts);
};
inherits(FeedContentView, ContentView);

FeedContentView.prototype._addInitialChildViews = function (opts) {
    opts = opts || {};

    this._tiledAttachmentListView = new TiledAttachmentListView(opts);
    this.add(this._tiledAttachmentListView, { render: false });

    this._headerView = new ContentHeaderView(opts);
    this.add(this._headerView, { render: false });

    this._blockAttachmentListView = new BlockAttachmentListView(opts);
    this.add(this._blockAttachmentListView, { render: false });

    this._bodyView = new ContentBodyView(opts);
    this.add(this._bodyView, { render: false });

    this._footerView = new ContentFooterView(opts);
    this.add(this._footerView, { render: false });

    this._editorView = new ContentEditorView(opts);
    this.add(this._editorView, { render: false });
};

module.exports = FeedContentView;
