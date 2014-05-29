'use strict';

var inherits = require('inherits');
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
    { type: LivefyreTwitterContent, mixins: [asLivefyreContentView, asTwitterContentView],
        typeUrn: 'urn:livefyre:js:streamhub-sdk:content:types:livefyre-twitter' },
    { type: LivefyreFacebookContent, mixins: [asLivefyreContentView, asFacebookContentView],
        typeUrn: 'urn:livefyre:js:streamhub-sdk:content:types:livefyre-facebook' },
    { type: LivefyreInstagramContent, mixins: [asLivefyreContentView, asInstagramContentView],
        typeUrn: 'urn:livefyre:js:streamhub-sdk:content:types:livefyre-instagram' },
    { type: TwitterContent, mixins: [asLivefyreContentView, asTwitterContentView],
        typeUrn: 'urn:livefyre:js:streamhub-sdk:content:types:twitter' },
    { type: LivefyreContent, mixins: [asLivefyreContentView],
        typeUrn: 'urn:livefyre:js:streamhub-sdk:content:types:livefyre' },
    { type: Content, mixins: [],
        typeUrn: 'urn:livefyre:js:streamhub-sdk:content' }
];

FeedContentViewFactory.prototype.createContentView = function (content, opts) {
    opts = opts || {};
    opts.themeClass = this._themeClass;

    var likeCommand = opts.likeCommand || this._createLikeCommand(content, opts.liker);
    var replyCommand = opts.replyCommand || this._createReplyCommand(content, opts.replyer);
    var shareCommand = opts.shareCommand || this._createShareCommand(content, opts.sharer);

    var contentView = new FeedContentView({
        content : content,
        likeCommand: likeCommand,
        replyCommand: replyCommand,
        shareCommand: shareCommand
    });

    var sourceTypeMixins = this._getSourceTypeMixinsForContent(content);
    for (var i=0; i < sourceTypeMixins.length; i++) {
        var asSourceTypeView = sourceTypeMixins[i];
        asSourceTypeView(contentView);
    }

    return contentView;
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
