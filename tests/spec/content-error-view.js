var $ = require('streamhub-sdk/jquery');
var LivefyreContent = require('streamhub-sdk/content/types/livefyre-content');
var ContentErrorView = require('streamhub-feed/content-error-view');

'use strict';

describe('ContentErrorView', function () {
    var content;

    beforeEach(function () {
        content = new LivefyreContent({ body: 'hi' });
    });

    describe('on construction', function () {
        it('accepts opts.error and sets #_error', function () {
            var errorView = new ContentErrorView({
                content: content,
                error: 'myerror'
            });
            expect(errorView._error).toBe('myerror');
        });

        it('accepts opts.actions and sets #_actions', function () {
            var errorView = new ContentErrorView({
                content: content,
                actions: 'myactions'
            });
            expect(errorView._actions).toBe('myactions');
        });

        it('binds a click event handler for retry/edit link', function () {
            var errorView = new ContentErrorView({
                content: content
            });
            var events = $._data(errorView.el, 'events');
            expect(events.click.length).toBe(1);
            expect(events.click[0].selector).toBe('a');
        });
    });

    describe('when rendering error', function () {

        var errorView,
            mockError;

        beforeEach(function () {
            mockError = {
                error_type: 'MyCustomError',
                msg: 'bad bad error!'
            };

            errorView = new ContentErrorView({
                content: content,
                error: mockError
            });
        });
        
        it('checks error type', function () {
            spyOn(errorView, 'getErrorType');
            errorView.render();
            expect(errorView.getErrorType).toHaveBeenCalled();
        });

        it('gets error message', function () {
            spyOn(errorView, 'getErrorMessage');
            errorView.render();
            expect(errorView.getErrorMessage).toHaveBeenCalled();
        });

        it('shows an edit link when DuplicateCommentError is rendered', function () {
            mockError.error_type = errorView.ERROR_TYPES.DUPLICATE_COMMENT;
            errorView.setError({ error: mockError });
            errorView.render();
            expect(errorView.$el.find('.'+errorView.editLinkClass).length).toBe(1);
        });
    });
});
