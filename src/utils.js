/**
 * Some basic HTML escaping - not robust
 * @param {string} raw
 */
export function basicHtmlEscape(raw) {
    var escaped = raw;
    escaped = escaped.replace(/&/g, '&amp;');
    escaped = escaped.replace(/</g, '&lt;');
    escaped = escaped.replace(/>/g, '&gt;');
    return escaped;
}

/**
 * Select the text inside an element
 * @param {HTMLElement} el
 * @param {Window} [win]
 * @see https://stackoverflow.com/a/2838358
 */
export function selectElementText(el, win) {
    win = win || window;
    let doc = win.document,
        sel,
        range;
    /* istanbul ignore next */
    if (win.getSelection && doc.createRange) {
        sel = win.getSelection();
        range = doc.createRange();
        range.selectNodeContents(el);
        if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
}
