var inherits = require('inherits');
var View = require('view');
var template = require('hgn!streamhub-feed/templates/content-error');
var errorViewStyles = require('less!streamhub-feed/styles/error-view');

'use strict';

var ContentErrorView = function (opts) {
    opts = opts || {};

    this._content = opts.content;
    if (opts.error) {
        this.setError(opts);
    }
    this._actions = opts.actions;

    View.call(this, opts);
};
inherits(ContentErrorView, View);

ContentErrorView.prototype.elClass = 'content-error';
ContentErrorView.prototype.retryLinkClass = 'content-retry-link';
ContentErrorView.prototype.editLinkClass = 'content-edit-link';
ContentErrorView.prototype.template = template;

ContentErrorView.prototype.events = View.prototype.events.extended({
    'click a': '_handleErrorAction'
});

ContentErrorView.prototype._handleErrorAction = function (e) {
    e.preventDefault();
    if (this.getErrorType() === this.ERROR_TYPES.DUPLICATE_COMMENT) {
        this._actions.edit();
    } else {
        this._actions.retry();
    }
};

ContentErrorView.prototype.ERROR_TYPES = {
    DUPLICATE_COMMENT: 'DuplicateCommentError'
};

ContentErrorView.prototype.setError = function (opts) {
    opts = opts || {};

    this._error = opts.error;
    this._actions = opts.actions;
};

ContentErrorView.prototype.getErrorType = function () {
    if (this._error && typeof this._error === 'object') {
        return this._error.error_type;
    }
};

ContentErrorView.prototype.getErrorMessage = function () {
    if (this._error && typeof this._error === 'object') {
        return this._error.msg;
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
