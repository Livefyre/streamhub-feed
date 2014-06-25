var inherits = require('inherits');
var View = require('view');
var template = require('hgn!streamhub-feed/templates/content-error');
var errorViewStyles = require('less!streamhub-feed/styles/error-view');

'use strict';

var ContentErrorView = function (opts) {
    opts = opts || {};

    this._content = opts.content;
    if (opts.error) {
        this.setError(opts.error);
    }
    this._retryFunc = opts.retryFunc;

    View.call(this, opts);
};
inherits(ContentErrorView, View);

ContentErrorView.prototype.elClass = 'content-error';
ContentErrorView.prototype.retryLinkClass = 'content-retry-link';
ContentErrorView.prototype.editLinkClass = 'content-edit-link';
ContentErrorView.prototype.template = template;

ContentErrorView.prototype.events = View.prototype.events.extended({
    'click': function (e) {
        e.preventDefault();
        if ($(e.target).hasClass(this.retryLinkClass) || $(e.target).hasClass(this.editLinkClass)) {
            this._action();
        }
    }
});

ContentErrorView.prototype.ERROR_TYPES = {
    DUPLICATE_COMMENT: 'DuplicateCommentError'
};

ContentErrorView.prototype.setError = function (opts) {
    opts = opts || {};

    this._error = opts.error;
    if (this.getErrorType() === this.ERROR_TYPES.DUPLICATE_COMMENT) {
        this._action = opts.actions.edit;
    } else {
        this._action = opts.actions.retry;
    }
};

ContentErrorView.prototype.getErrorType = function () {
    if (this._error && typeof this._error === 'object') {
        return this._error.body.error_type;
    }
};

ContentErrorView.prototype.getErrorMessage = function () {
    if (this._error && typeof this._error === 'object') {
        return this._error.body.msg;
    }
    return this._error;
};

ContentErrorView.prototype.getTemplateContext = function () {
    var context = View.prototype.getTemplateContext.call(this);

    context.error = this.getErrorMessage();
    context.edit = this.getErrorType() === this.ERROR_TYPES.DUPLICATE_COMMENT;
    context.retry = !context.edit;

    return context;
};

module.exports = ContentErrorView;
