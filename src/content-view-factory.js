var inherits = require('inherits');
var Command = require('streamhub-sdk/ui/command');
var FeedContentView = require('streamhub-feed/content-view');
var BaseContentViewFactory = require('streamhub-sdk/content/content-view-factory');
var Content = require('streamhub-sdk/content');
var LivefyreContent = require('streamhub-sdk/content/types/livefyre-content');
var LivefyreTwitterContent = require('streamhub-sdk/content/types/livefyre-twitter-content');
var LivefyreFacebookContent = require('streamhub-sdk/content/types/livefyre-facebook-content');
var LivefyreInstagramContent = require('streamhub-sdk/content/types/livefyre-instagram-content');
var TwitterContent = require('streamhub-sdk/content/types/twitter-content');
var asLivefyreContentView = require('streamhub-sdk/content/views/mixins/livefyre-content-view-mixin');
var asTwitterContentView = require('streamhub-sdk/content/views/mixins/twitter-content-view-mixin');
var asFacebookContentView = require('streamhub-sdk/content/views/mixins/facebook-content-view-mixin');
var asInstagramContentView = require('streamhub-sdk/content/views/mixins/instagram-content-view-mixin');
var AuthEditor = require('streamhub-editor/auth-editor');
var TYPE_URNS = require('streamhub-sdk/content/types/type-urns');

'use strict';

var FeedContentViewFactory = function (opts) {
    opts = opts || {};

    BaseContentViewFactory.call(this, opts);

    this._themeClass = 'content-feed';
};
inherits(FeedContentViewFactory, BaseContentViewFactory);

/**
 * The default registry for Content -> ContentView rendering.
 * Expects entries to always contain a "type" property, and either a view property
 * (the type function itself) or a viewFunction property (a function that returns a
 * type function, useful for conditional view selection.).
 */
FeedContentViewFactory.prototype.contentRegistry = [
    { type: LivefyreTwitterContent, mixins: [asTwitterContentView],
        typeUrn: TYPE_URNS.LIVEFYRE_TWITTER },
    { type: LivefyreFacebookContent, mixins: [asLivefyreContentView, asFacebookContentView],
        typeUrn: TYPE_URNS.LIVEFYRE_FACEBOOK},
    { type: LivefyreInstagramContent, mixins: [asLivefyreContentView, asInstagramContentView],
        typeUrn: TYPE_URNS.LIVEFYRE_INSTAGRAM },
    { type: TwitterContent, mixins: [asTwitterContentView],
        typeUrn: TYPE_URNS.TWITTER },
    { type: LivefyreContent, mixins: [asLivefyreContentView],
        typeUrn: TYPE_URNS.LIVEFYRE },
    { type: Content, mixins: [],
        typeUrn: TYPE_URNS.CONTENT }
];

FeedContentViewFactory.prototype.createContentView = function (content, opts) {
    opts = opts || {};
    var themeClass = opts.themeClass || this._themeClass;

    var likeCommand = opts.likeCommand || this._createLikeCommand(content, opts.liker);
    var replyCommand = opts.replyCommand || this._createReplyCommand(content, opts.replyer);
    var shareCommand = opts.shareCommand || this._createShareCommand(content, opts.sharer);
    var editorView = opts.editorView || new AuthEditor({
        collection: content.collection,
        contentParentId: content.id
    });

    var contentViewOpts = {
        themeClass: themeClass,
        content: content,
        attachmentsView: opts.attachmentsView,
        editorView: editorView,
        likeCommand: likeCommand,
        replyCommand: replyCommand,
        shareCommand: shareCommand
    };
    var contentView = new FeedContentView(contentViewOpts);

    var sourceTypeMixins = this._getSourceTypeMixinsForContent(content);
    for (var i=0; i < sourceTypeMixins.length; i++) {
        var asSourceTypeView = sourceTypeMixins[i];
        asSourceTypeView(contentView, contentViewOpts);
    }

    return contentView;
};

FeedContentViewFactory.prototype._createReplyCommand = function (content, replyer) {
    var replyCommand;
    if (typeof replyer === 'function') {
        replyCommand = new Command(function () {
            replyer(content);
        });
    } else {
        replyCommand = new Command(function () {});
    }
    return replyCommand;
};

FeedContentViewFactory.prototype._getSourceTypeMixinsForContent = function (content) {
    for (var i=0, len=this.contentRegistry.length; i < len; i++) {
        var current = this.contentRegistry[i];
        var sameTypeUrn = content.typeUrn && (current.typeUrn === content.typeUrn);
        if (! (sameTypeUrn || (content instanceof current.type))) {
            continue;
        }

        return current.mixins || [];
    }
};

module.exports = FeedContentViewFactory;
