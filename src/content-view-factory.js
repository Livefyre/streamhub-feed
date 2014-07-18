var inherits = require('inherits');
var Command = require('streamhub-sdk/ui/command');
var FeedContentView = require('streamhub-feed/content-view');
var BaseContentViewFactory = require('streamhub-sdk/content/content-view-factory');
var Content = require('streamhub-sdk/content');
var LivefyreContent = require('streamhub-sdk/content/types/livefyre-content');
var LivefyreTwitterContent = require('streamhub-sdk/content/types/livefyre-twitter-content');
var LivefyreUrlContent = require('streamhub-sdk/content/types/livefyre-content');
var LivefyreFacebookContent = require('streamhub-sdk/content/types/livefyre-facebook-content');
var LivefyreInstagramContent = require('streamhub-sdk/content/types/livefyre-instagram-content');
var TwitterContent = require('streamhub-sdk/content/types/twitter-content');
var asLivefyreContentView = require('streamhub-sdk/content/views/mixins/livefyre-content-view-mixin');
var asTwitterContentView = require('streamhub-sdk/content/views/mixins/twitter-content-view-mixin');
var asFacebookContentView = require('streamhub-sdk/content/views/mixins/facebook-content-view-mixin');
var asInstagramContentView = require('streamhub-sdk/content/views/mixins/instagram-content-view-mixin');
var asUrlContentView = require('streamhub-sdk/content/views/mixins/url-content-view-mixin');
var AuthEditor = require('streamhub-editor/auth-editor');
var TYPE_URNS = require('streamhub-sdk/content/types/type-urns');
var editori18n = require('./editor-i18n');

'use strict';

var FeedContentViewFactory = function (opts) {
    opts = opts || {};

    BaseContentViewFactory.call(this, opts);
    this._ContentTypeView = opts.contentTypeView || FeedContentView;
};
inherits(FeedContentViewFactory, BaseContentViewFactory);

FeedContentViewFactory.mixins = {
    TWITTER_CONTENT: [asTwitterContentView],
    FACEBOOK_CONTENT: [asLivefyreContentView, asFacebookContentView],
    INSTAGRAM_CONTENT: [asLivefyreContentView, asInstagramContentView],
    LIVEFYRE_URL_CONTENT: [asLivefyreContentView, asUrlContentView],
    LIVEFYRE_CONTENT: [asLivefyreContentView]
};

/**
 * The default registry for Content -> ContentView rendering.
 * Expects entries to always contain a "type" property, and either a view property
 * (the type function itself) or a viewFunction property (a function that returns a
 * type function, useful for conditional view selection.).
 */
FeedContentViewFactory.prototype.contentRegistry = [
    { type: LivefyreTwitterContent,
        mixins: FeedContentViewFactory.mixins.TWITTER_CONTENT,
        typeUrn: TYPE_URNS.LIVEFYRE_TWITTER },
    { type: LivefyreFacebookContent,
        mixins: FeedContentViewFactory.mixins.FACEBOOK_CONTENT,
        typeUrn: TYPE_URNS.LIVEFYRE_FACEBOOK},
    { type: LivefyreInstagramContent,
        mixins: FeedContentViewFactory.mixins.INSTAGRAM_CONTENT,
        typeUrn: TYPE_URNS.LIVEFYRE_INSTAGRAM },
    { type: TwitterContent, mixins:
        FeedContentViewFactory.mixins.TWITTER_CONTENT,
        typeUrn: TYPE_URNS.TWITTER },
    { type: LivefyreUrlContent,
        mixins: FeedContentViewFactory.mixins.LIVEFYRE_URL_CONTENT,
        typeUrn: TYPE_URNS.LIVEFYRE_URL },
    { type: LivefyreContent,
        mixins: FeedContentViewFactory.mixins.LIVEFYRE_CONTENT,
        typeUrn: TYPE_URNS.LIVEFYRE },
    { type: Content,
        mixins: [],
        typeUrn: TYPE_URNS.CONTENT }
];

FeedContentViewFactory.prototype.createContentView = function (content, opts) {
    opts = opts || {};

    var likeCommand = opts.likeCommand || this._createLikeCommand(content, opts.liker);
    var replyCommand = opts.replyCommand || this._createReplyCommand(content, opts.replyer);
    var shareCommand = opts.shareCommand || this._createShareCommand(content, opts.sharer);

    var editorView = opts.editorView || new AuthEditor({
        collection: content.collection,
        contentParentId: content.id,
        i18n: editori18n(content)
    });

    var contentViewOpts = {
        content: content,
        attachmentsView: opts.attachmentsView,
        editorView: editorView,
        likeCommand: likeCommand,
        replyCommand: replyCommand,
        shareCommand: shareCommand
    };
    var contentView = new this._ContentTypeView(contentViewOpts);

    var sourceTypeMixins = this._getSourceTypeMixinsForContent(content);
    for (var i=0; i < sourceTypeMixins.length; i++) {
        var asSourceTypeView = sourceTypeMixins[i];
        asSourceTypeView(contentView, contentViewOpts);
    }

    // Disable reply button for content without id
    if (contentView._replyButton && !content.id) {
        contentView._replyButton.disable();
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
    if (content.typeUrn === TYPE_URNS.LIVEFYRE_URL) {
        var typeId = content.urlContentTypeId || "";
        typeId = typeId.toLowerCase();

        //Set urn so that other bits that rely on it
        //treat content as it should be.
        if (typeId.indexOf("twitter.com") >= 0) {
            return FeedContentViewFactory.mixins.TWITTER_CONTENT;
        }

        if (typeId.indexOf("facebook.com") >= 0) {
            return FeedContentViewFactory.mixins.FACEBOOK_CONTENT;
        }

        if (typeId.indexOf("instagram.com") >= 0) {
            return FeedContentViewFactory.mixins.INSTAGRAM_CONTENT;
        }
    }

    for (var i=0, len=this.contentRegistry.length; i < len; i++) {
        var current = this.contentRegistry[i];
        var sameTypeUrn = content.typeUrn && (current.typeUrn === content.typeUrn);
        if (!sameTypeUrn || !(content instanceof current.type)) {
            continue;
        }

        return current.mixins || [];
    }
};

module.exports = FeedContentViewFactory;
