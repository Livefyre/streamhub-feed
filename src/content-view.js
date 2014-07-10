var $ = require('streamhub-sdk/jquery');
var inherits = require('inherits');
var ContentView = require('streamhub-sdk/content/views/content-view');
var ContentHeaderView = require('streamhub-sdk/content/views/content-header-view');
var ContentBodyView = require('streamhub-sdk/content/views/content-body-view');
var ContentErrorView = require('streamhub-feed/content-error-view');
var ContentFooterView = require('streamhub-sdk/content/views/content-footer-view');
var TiledAttachmentListView = require('streamhub-sdk/content/views/tiled-attachment-list-view');
var BlockAttachmentListView = require('streamhub-sdk/content/views/block-attachment-list-view');
var ContentEditorView = require('streamhub-editor/auth-editor');
var feedContentStyles = require('less!streamhub-feed/css/style.less');
var hasTheme = require('streamhub-sdk/content/views/mixins/theme-mixin');

'use strict';

var FeedContentView = function (opts) {
    opts = opts || {};

    hasTheme(this, 'content-feed');
    ContentView.call(this, opts);

    this.content.on('change:id', function (contentId) {
        this._replyButton.enable();
        this._editorView.setContentParentId(contentId);
    }.bind(this));
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
        this._editorView.reset();
    }
});

FeedContentView.prototype.toggleReplies = function (show) {
    this._editorView.$el.toggle(show);
    this._editorView.$el.find('.'+this._editorView.classes.FIELD).focus();
};

FeedContentView.prototype.setEditorValue = function (value) {
    this._editorView.setContents(value);
};

FeedContentView.prototype.displayError = function (err, actions) {
    if (! this._errorView) {
        return;
    }
    this._errorView.setError({ error: err, actions: actions });
    this._errorView.render();
    this.$el.addClass(this.invalidClass);

    for (var i=0; i < this._footerView._controls.left.length; i++) {
        this._footerView._controls.left[i].disable();
    }
    for (var i=0; i < this._footerView._controls.right.length; i++) {
        this._footerView._controls.right[i].disable();
    }
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

    this._errorView = new ContentErrorView(opts);
    this.add(this._errorView, { render: false });

    this._footerView = new ContentFooterView(opts);
    this.add(this._footerView, { render: false });

    this._editorView = new ContentEditorView({
        collection: opts.content.collection,
        contentParentId: opts.content.id        
    });
    this.add(this._editorView, { render: false });
};

module.exports = FeedContentView;
