var LivefyreContent = require('streamhub-sdk/content/types/livefyre-content');
var Collection = require('streamhub-sdk/collection');
var FeedContentView = require('streamhub-feed/content-view');
var FeedContentViewFactory = require('streamhub-feed/content-view-factory');
var ContentHeaderView = require('streamhub-sdk/content/views/content-header-view');
var ContentBodyView = require('streamhub-sdk/content/views/content-body-view');
var ContentFooterView = require('streamhub-sdk/content/views/content-footer-view');
var TiledAttachmentListView = require('streamhub-sdk/content/views/tiled-attachment-list-view');
var BlockAttachmentListView = require('streamhub-sdk/content/views/block-attachment-list-view');
var AuthEditorView = require('streamhub-editor/auth-editor');

'use strict';

describe('FeedContentView', function () {
    var content,
        collection,
        contentView;

    beforeEach(function () {
        content = new LivefyreContent({ body: 'hi' });
        content.collection = new Collection();
        contentView = new FeedContentViewFactory().createContentView(content);
    });

    describe('Composite child views', function () {
        it('first child view is a TiledAttachmentListView', function () {
            expect(contentView._childViews[0] instanceof TiledAttachmentListView).toBe(true);
        });

        it('second child view is a ContentHeaderView', function () {
            expect(contentView._childViews[1] instanceof ContentHeaderView).toBe(true);
        });

        it('third child view is a BlockAttachmentListView', function () {
            expect(contentView._childViews[2] instanceof BlockAttachmentListView).toBe(true);
        });

        it('fourth child view is a BodyView', function () {
            expect(contentView._childViews[3] instanceof ContentBodyView).toBe(true);
        });

        it('fifth child view is a FooterView', function () {
            expect(contentView._childViews[4] instanceof ContentFooterView).toBe(true);
        });

        it('sixth child view is an AuthEditorView', function () {
            expect(contentView._childViews[5] instanceof AuthEditorView).toBe(true);
        });
    });

    it('toggles reply editor when reply button clicked', function () {
        contentView.render();

        // Toggle on editor
        var replyButtonEl = contentView.$el.find('.hub-content-reply');
        spyOn(contentView, 'toggleReplies').andCallThrough();
        replyButtonEl.trigger('click');
        expect(contentView.toggleReplies).toHaveBeenCalledWith(true);
        expect(contentView._editorView.$el.css('display')).toBe('block');
    });

    it('hides the reply editor upon successful post', function () {
        contentView.render();

        // Toggle on editor
        var replyButtonEl = contentView.$el.find('.hub-content-reply');
        replyButtonEl.trigger('click');
        expect(contentView._editorView.$el.css('display')).toBe('block');

        // writeSuccess.hub
        spyOn(contentView, 'toggleReplies').andCallThrough();
        contentView._editorView.$el.trigger('writeSuccess.hub');
        expect(contentView.toggleReplies).toHaveBeenCalledWith(false);
        expect(contentView._editorView.$el.css('display')).toBe('none');
    });
});
