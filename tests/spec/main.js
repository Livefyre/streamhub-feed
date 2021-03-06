var FeedView = require('streamhub-feed/feed-view');
var Content = require('streamhub-sdk/content');
var Collection = require('streamhub-sdk/collection');
var ContentThreadView = require('thread');
var ListView = require('streamhub-sdk/views/list-view');

'use strict';

describe('FeedView', function () {
    var content,
        feedView;

    beforeEach(function () {
        content = new Content({ body: 'hi'});
        content.collection = new Collection();
        feedView = new FeedView();
    });

    it('creates a ContentThreadView when adding content', function () {
        feedView.add(content);
        expect(feedView.views.length).toBe(1);
        expect(feedView.views[0] instanceof ContentThreadView);
    });

    it('has a default comparator', function () {
        expect(feedView.comparator).toBe(ListView.prototype.comparators.CREATEDAT_DESCENDING);
    });
});
