/**
 * Get the i18n strings for an editorView
 */
module.exports = function (content) {
    var editorStrings = {};
    if (content && content.author && content.author.displayName) {
        editorStrings.PLACEHOLDERTEXT = 'Reply to '+content.author.displayName;
    }
    return editorStrings;
};
