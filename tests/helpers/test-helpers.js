// @ts-check

const toolbarWrapperSelector = '.jToolbarWrapper';

/**
 * Test whether an element is (or contains) an initialized jPrismToolbar instance
 * @param {HTMLElement} elem
 * @returns {boolean}
 */
const checkElemInit = elem => {
    // Check self or children
    let toolbarWrapper = elem.matches(toolbarWrapperSelector) ? elem : elem.querySelector(toolbarWrapperSelector);
    if (!toolbarWrapper && elem.nodeName === 'PRE') {
        // Check previous sibling
        const prevSibling = elem.previousElementSibling;
        toolbarWrapper = prevSibling.matches(toolbarWrapperSelector) ? prevSibling : null;
    }
    return !!toolbarWrapper && toolbarWrapper.querySelectorAll('*').length > 2;
};

const getInstBySelector = (domInstances, selector) => {
    return domInstances.filter(instance => {
        return instance.codeElem.matches(selector);
    });
};

/**
 * Get instance by ID
 * @param {string} elementId
 * @returns {object | undefined}
 */
const getInstById = (domInstances, elementId) => {
    return getInstBySelector(domInstances, `#${elementId}`)[0];
};

const logDom = () => {
    console.log(document.body.innerHTML);
};

module.exports = {
    checkElemInit,
    toolbarWrapperSelector,
    logDom,
    getInstBySelector,
    getInstById
};
