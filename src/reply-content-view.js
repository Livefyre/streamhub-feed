var inherits = require('inherits');
var FeedContentView = require('streamhub-feed/content-view');
var ContentHeaderView = require('streamhub-sdk/content/views/content-header-view');
var ContentBodyView = require('streamhub-sdk/content/views/content-body-view');
var ContentErrorView = require('streamhub-feed/content-error-view');
var ContentFooterView = require('streamhub-sdk/content/views/content-footer-view');
var TiledAttachmentListView = require('streamhub-sdk/content/views/tiled-attachment-list-view');
var BlockAttachmentListView = require('streamhub-sdk/content/views/block-attachment-list-view');
var ContentEditorView = require('streamhub-editor/auth-editor');
var editori18n = require('./editor-i18n');

'use strict';

var FeedReplyContentView = function (opts) {
    opts = opts || {};
    FeedContentView.call(this, opts);
};
inherits(FeedReplyContentView, FeedContentView);

FeedContentView.prototype._addInitialChildViews = function (opts) {
    opts = opts || {};

    this._headerView = opts.headerView || this._headerViewFactory.createHeaderView(opts.content);
    this.add(this._headerView, { render: false });

    this._blockAttachmentListView = new BlockAttachmentListView(opts);
    this.add(this._blockAttachmentListView, { render: false });

    this._bodyView = new ContentBodyView(opts);
    this.add(this._bodyView, { render: false });

    this._tiledAttachmentListView = new TiledAttachmentListView(opts);
    this.add(this._tiledAttachmentListView, { render: false });

    this._errorView = new ContentErrorView(opts);
    this.add(this._errorView, { render: false });

    this._footerView = new ContentFooterView(opts);
    this.add(this._footerView, { render: false });

    var content = opts.content;
    this._editorView = new ContentEditorView({
        collection: content.collection,
        contentParentId: content.id,
        i18n: editori18n(content)
    });
    this.add(this._editorView, { render: false });
};

module.exports = FeedReplyContentView;
