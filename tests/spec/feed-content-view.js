var LivefyreContent = require('streamhub-sdk/content/types/livefyre-content');
var Collection = require('streamhub-sdk/collection');
var FeedContentView = require('streamhub-feed/content-view');
var FeedContentViewFactory = require('streamhub-feed/content-view-factory');
var ContentHeaderView = require('streamhub-sdk/content/views/content-header-view');
var ContentBodyView = require('streamhub-sdk/content/views/content-body-view');
var ContentErrorView = require('streamhub-feed/content-error-view');
var ContentFooterView = require('streamhub-sdk/content/views/content-footer-view');
var TiledAttachmentListView = require('streamhub-sdk/content/views/tiled-attachment-list-view');
var BlockAttachmentListView = require('streamhub-sdk/content/views/block-attachment-list-view');
var AuthEditorView = require('streamhub-editor/auth-editor');

'use strict';

describe('FeedContentView', function () {
    var content,
        collection,
        contentView;

    describe('construction', function () {

        beforeEach(function () {
            content = new LivefyreContent({ body: 'hi' });
            content.collection = new Collection();
            contentView = new FeedContentViewFactory().createContentView(content);
        });

        it('this.content listens for the id:change event; enables the reply button', function () {
            expect(content.id).toBe(undefined);
            expect(contentView._replyButton._disabled).toBe(true);
            content.set({ id: '7485' });
            expect(contentView._replyButton._disabled).toBe(false);
        });
    });

    describe('Composite child views', function () {

        beforeEach(function () {
            content = new LivefyreContent({ body: 'hi' });
            content.collection = new Collection();
            contentView = new FeedContentViewFactory().createContentView(content);
        });

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

        it('fifth child view is a ErrorView', function () {
            expect(contentView._childViews[4] instanceof ContentErrorView).toBe(true);
        });

        it('sixth child view is a FooterView', function () {
            expect(contentView._childViews[5] instanceof ContentFooterView).toBe(true);
        });

        it('seventh child view is an AuthEditorView', function () {
            expect(contentView._childViews[6] instanceof AuthEditorView).toBe(true);
        });
    });

    it('toggles reply editor when reply button clicked', function () {
        contentView.render();

        // Toggle on editor
        var replyButtonEl = contentView.$el.find('.hub-content-reply');
        spyOn(contentView, 'toggleReplies').andCallThrough();
        replyButtonEl.trigger('click');
        expect(contentView.toggleReplies).toHaveBeenCalled();
        expect(contentView._editorView.$el.css('display')).toBe('block');
    });

    it('hides the reply editor upon post', function () {
        contentView.render();

        // Toggle on editor
        var replyButtonEl = contentView.$el.find('.hub-content-reply');
        replyButtonEl.trigger('click');
        expect(contentView._editorView.$el.css('display')).toBe('block');

        // writeSuccess.hub
        spyOn(contentView, 'toggleReplies').andCallThrough();
        contentView._editorView.$el.trigger('writeContent.hub');
        expect(contentView.toggleReplies).toHaveBeenCalledWith(false);
        expect(contentView._editorView.$el.css('display')).toBe('none');
    });
});
