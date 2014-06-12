var FeedView = require('streamhub-feed');
var Content = require('streamhub-sdk/content');
var Collection = require('streamhub-sdk/collection');
var ContentThreadView = require('thread');

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
});
