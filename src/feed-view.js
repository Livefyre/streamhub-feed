var $ = require('streamhub-sdk/jquery');
var inherits = require('inherits');
var Auth = require('auth');
var ListView = require('streamhub-sdk/views/list-view');
var ContentThreadView = require('thread');
var FeedContentViewFactory = require('streamhub-feed/content-view-factory');
var FeedReplyContentView = require('streamhub-feed/reply-content-view');
var threadViewStyles = require('less!streamhub-feed/css/style.less');
var hasAttachmentModal = require('streamhub-sdk/content/views/mixins/attachment-modal-mixin');
var hasQueue = require('streamhub-sdk/views/mixins/queue-mixin');
var sdkStyle = require('css!streamhub-sdk/css/style.css');
var feedViewTemplate = require('hgn!streamhub-feed/templates/feed-view');

'use strict';

var FeedView = function (opts) {
    opts = opts || {};

    this.comparator = opts.comparator || this.comparator;
    this._queueInitial = opts.queueInitial = opts.queueInitial || 0;

    this._hideReplies = opts.hideReplies === undefined ? false : !!opts.hideReplies;
    this._replying = opts.replying === undefined ? true : !!opts.replying;
    if (this._hideReplies) {
        this._replying = false;
    }
    this._contentViewFactory = opts.contentViewFactory || new FeedContentViewFactory();
    if (this._contentViewFactory.setReplying) {
        this._contentViewFactory.setReplying(this._replying);
    }

    var listOpts = $.extend({
        template: feedViewTemplate,
        autoRender: false
    }, opts);
    ListView.call(this, listOpts);
    hasQueue(this, opts);
    
    opts.autoRender = opts.autoRender === undefined ? true : opts.autoRender;
    if (opts.autoRender) {
        this.render();
    }

    hasAttachmentModal(this, opts.modal);
};
inherits(FeedView, ListView);

FeedView.prototype.add = function (content) {
    var contentView = this._createContentView(content);
    ListView.prototype.add.call(this, contentView);
};

FeedView.prototype.comparator = ListView.prototype.comparators.CREATEDAT_DESCENDING;

/**
 * Called automatically by the Writable base class when .write() is called
 * @private
 * @param content {Content} Content to display in the ListView
 * @param requestMore {function} A function to call when done writing, so
 *     that _write will be called again with more data
 */
FeedView.prototype._write = function (content, requestMore) {
    if (content.author.id === (Auth.get('livefyre') && Auth.get('livefyre').get('id'))) {
        this.add(content);
    } else {
        this.queue.write(content);
    }

    requestMore();
};

FeedView.prototype._createContentView = function (content) {
    if (this._hideReplies) {
        return this._contentViewFactory.createContentView(content, {
            replyCommand: false
        });
    }

    return new ContentThreadView({
        content: content,
        rootContentView: this._contentViewFactory.createContentView(content),
        contentViewFactory: new FeedContentViewFactory({
            contentTypeView: FeedReplyContentView,
            replying: this._replying
        }),
        queueInitial: this._queueInitial
    });
};

module.exports = FeedView;
