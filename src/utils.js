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

/**
 * Get a link that opens in a new tab, with noopener
 * @param {string} url
 * @param {string | null} [linkText]
 * @param {string} [style]
 */
export function getNewTabLink(url, linkText, style) {
    return `<a target="_blank" rel="noopener" href="${url}"${!!style ? ` style="${style}"` : ''}>${
        linkText || url
    }</a>`;
}

/**
 * Utility function since can't use post-fix assert in JSDoc
 * @template T
 * @param {T} elem
 * @returns {Exclude<T, null>}
 */
export function assertElem(elem) {
    return /** @type {Exclude<T, null>} */ (elem);
}
