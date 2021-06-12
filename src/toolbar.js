/**
 * @typedef {import('./types').InstanceConfig} InstanceConfig
 * @typedef {import('./types').GlobalConfig} GlobalConfig
 * @typedef {import('./types').ToolbarInstance} ToolbarInstance
 */

import { LangKeys, PkgPrefix } from './constants';
import { JPrismToolbarUI } from './ui';
import { assertElem, basicHtmlEscape, getNewTabLink, selectElementText } from './utils';

export class PrismToolbar {
    /**
     * Private Members
     */
    /** @type {Partial<GlobalConfig>} */
    #_inputSettings = {};
    #_injectedStyles = false;
    #_idCounter = 0;

    /**
     * Public Members
     */
    debug = false;
    /** @type {ToolbarInstance[]} */
    domInstances = [];
    /** @type {HTMLElement[]} */
    targetElementsArr = [];
    /** @type {string | undefined}  */
    selector = undefined;

    /** @param {Partial<GlobalConfig> | string} [inputSettings] */
    constructor(inputSettings) {
        this.#_inputSettings = typeof inputSettings === 'object' ? inputSettings : {};

        // Let user pass selector as main arg to constructor, instead of config obj
        if (typeof inputSettings === 'string') {
            this.#_inputSettings = {
                selector: inputSettings,
            };
        }

        this.selector = typeof this.#_inputSettings.selector === 'string' ? this.#_inputSettings.selector : undefined;

        /** @type {InstanceConfig['iconStyle'][]} */
        const iconStyleChoices = ['emoji', 'plaintext', 'material', 'fontawesome'];

        // Fill in global settings based on input, using defaults where appropriate
        /** @type {GlobalConfig} */
        this.settings = {
            wrapCombo: typeof this.#_inputSettings.wrapCombo === 'boolean' ? this.#_inputSettings.wrapCombo : true,
            animate: typeof this.#_inputSettings.animate === 'boolean' ? this.#_inputSettings.animate : true,
            lineWrap: typeof this.#_inputSettings.lineWrap === 'boolean' ? this.#_inputSettings.lineWrap : false,
            remoteSrc: typeof this.#_inputSettings.remoteSrc === 'string' ? this.#_inputSettings.remoteSrc : false,
            debug: typeof this.#_inputSettings.debug === 'boolean' ? this.#_inputSettings.debug : false,
            // @ts-ignore
            iconStyle: iconStyleChoices.includes(this.#_inputSettings.iconStyle)
                ? this.#_inputSettings.iconStyle
                : 'emoji',
            autoFix: typeof this.#_inputSettings.autoFix === 'boolean' ? this.#_inputSettings.autoFix : false,
        };
        this.debug = this.settings.debug;

        this.uiController = new JPrismToolbarUI(this.settings);

        if (!this.#_injectedStyles) {
            var styleBlock = document.createElement('style');
            styleBlock.innerText = this.uiController.getToolbarCss();
            document.getElementsByTagName('body')[0].appendChild(styleBlock);
            this.#_injectedStyles = true;
        }
    }

    getNewInstanceId() {
        return `jPtbId_${++this.#_idCounter}`;
    }

    /**
     * Main initialization function
     *  - Uses inputs from constructor arguments / settings
     */
    async init() {
        /** @type {Promise<any>[]} */
        const promiseArr = [];
        this.populateListOfTargets();
        if (this.targetElementsArr.length > 0) {
            // Main toolbar injector iterator
            for (var x = 0; x < this.targetElementsArr.length; x++) {
                // Get per-instance config
                const elem = this.targetElementsArr[x];
                promiseArr.push(this.initOnElem(elem));
            }
        } else {
            console.warn('init was called, but no suitable targets could be found');
        }

        await Promise.all(promiseArr);

        // Init ClipboardJS
        if (this.getHasClipboardJS() === true) {
            this.initClipboardJS();
        } else {
            setTimeout(() => {
                this.initClipboardJS();
            }, 2000);
        }

        return this;
    }

    /**
     * Attempts to run initialization for elements matching selector
     * @param {string} [OPT_autoSelector]
     */
    async autoInit(OPT_autoSelector) {
        let initRes;
        const originalSelector = this.selector;
        this.selector =
            typeof OPT_autoSelector === 'string'
                ? OPT_autoSelector
                : 'pre > code[class*="language-"], code[data-jptremote]';
        this.settings.wrapCombo = false;
        initRes = await this.init();

        // Reset
        this.selector = originalSelector;

        return initRes;
    }

    /**
     * Tries to auto init all code blocks, based on element types
     */
    autoInitAll() {
        return this.autoInit('pre > code[class*="language-"], pre[class] > code');
    }

    /**
     * @param {HTMLElement} elem
     */
    async initOnElem(elem) {
        const config = this.getPerInstanceConfig(elem);

        // Now, in this context, elem is the code element (pre usually)
        const toolbarElem = document.createElement('div');
        toolbarElem.className = 'jToolbarWrapper jPTbStyl';
        toolbarElem.innerHTML = this.uiController.getToolbarHtml(this.settings);

        // Check to see if <pre></pre> is already wrapped with toolbar wrapper - if not, wrap it
        if (elem.parentElement && !elem.parentElement.classList.contains('jPtbWrapCombo') && config.wrapCombo) {
            const wrapper = document.createElement('div');
            wrapper.className = 'jPtbWrapCombo';
            // Add the wrapper as a sibling, before, of the code container
            elem.parentElement.insertBefore(wrapper, elem);
            // move into wrapper
            wrapper.appendChild(elem);
        }

        // No matter what, toolbar wrapper is now in place, and elem definitely has parent element
        const parentElem = /** @type {HTMLElement} */ (elem.parentElement);

        // Toolbar should be added BEFORE <pre></pre>, not inside it
        parentElem.insertBefore(toolbarElem, elem);

        // Directly add transition CSS to elements
        if (config.animate) {
            elem.style.transition = 'all 1s';
        }

        // Generate ID for code element and set as target of copy button
        let codeElemId = elem.getAttribute('id');
        const copyButton = /** @type {HTMLElement} */ (toolbarElem.querySelector('.jCopyButton'));
        if (!codeElemId || codeElemId === '') {
            codeElemId = this.getNewInstanceId();
            elem.setAttribute('id', codeElemId);
        }
        copyButton.setAttribute('data-clipboard-target', '#' + codeElemId);

        // See if line-wrap should be turned on to start with
        if (config.lineWrap) {
            elem.classList.add('jCodeForceLineWrap');
            // @ts-ignore
            toolbarElem.querySelector('.jPTbrTogLWrap').setAttribute('data-linewrapon', 'true');
        }

        // Wrap up all properties into a nice "instance" object
        /** @type {ToolbarInstance} */
        const createdInstance = {
            container: parentElem,
            codeElem: elem,
            toolbarElem: toolbarElem,
            collapsed: false,
            copyButton: copyButton,
            clipboardInitialized: false,
            eventsAttached: false,
            config: config,
            isMaximized: false,
            fullscreenWrapper: undefined,
        };

        // Save
        this.domInstances.push(createdInstance);

        // Check if instance is supposed to pull content from remote URL
        if (typeof config.remoteSrc === 'string' && !!config.remoteSrc) {
            const innerText = elem.innerText || elem.textContent;
            if (!!innerText && this.debug) {
                console.warn('Overwriting code content with AJAX content');
            }
            await this.loadRemoteCode(createdInstance, config.remoteSrc);
        }

        // Check if we should apply auto-fix
        if (config.autoFix) {
            this.autoFix(elem);
        }

        // Attach listeners
        this.attachEventListeners();

        return createdInstance;
    }

    initClipboardJS() {
        /** @param {ToolbarInstance} instance */
        const attachClipboardToInstance = (instance) => {
            if (instance.clipboardInitialized === false && this.getHasClipboardJS() === true) {
                instance.ClipboardJSInstance = new ClipboardJS(instance.copyButton);
                instance.ClipboardJSInstance.on('success', function (e) {
                    console.log(e);
                });
                instance.ClipboardJSInstance.on('error', function (e) {
                    console.warn('issue with ClipboardJS');
                    console.warn(e);
                });
            }
        };
        this.iterator(attachClipboardToInstance);
    }

    /**
     * Force jPrismToolbar to evaluate inputs to determine which elements to target for adding the toolbar to
     */
    populateListOfTargets() {
        const inputSettings = this.#_inputSettings;
        // Reset
        /** @type {NodeListOf<HTMLElement> | HTMLElement[]} */
        let _inputTargetElementsArr = [];
        this.targetElementsArr = [];

        // Check for single element or NodeList passed as target option
        if (inputSettings.targetElements && inputSettings.targetElements instanceof NodeList) {
            // NodeList
            _inputTargetElementsArr = inputSettings.targetElements;
        } else if (inputSettings.targetElements && typeof inputSettings.targetElements.nodeName === 'string') {
            // Single element
            _inputTargetElementsArr = [inputSettings.targetElements];
        } else if (this.selector && typeof this.selector === 'string') {
            // String CSS selector
            _inputTargetElementsArr = document.querySelectorAll(this.selector);
        }

        // Pre-filter targets
        for (let x = 0; x < _inputTargetElementsArr.length; x++) {
            let currTarget = _inputTargetElementsArr[x];
            // preference is for <pre></pre>
            if (currTarget.nodeName === 'PRE') {
                this.targetElementsArr.push(currTarget);
            } else if (
                currTarget.nodeName === 'CODE' &&
                currTarget.parentElement &&
                currTarget.parentElement.nodeName === 'PRE'
            ) {
                this.targetElementsArr.push(currTarget.parentElement);
            } else {
                // Invalid element passed
            }
        }
    }

    /**
     *
     * @param {HTMLElement} element
     * @returns {InstanceConfig}
     */
    getPerInstanceConfig(element) {
        // Copy settings from main setup
        /** @type {InstanceConfig} */
        const config = {
            ...this.settings,
        };
        // let inline HTML attributes override settings
        /** @type {import('./types').OverrideMap[]} */
        const allowedOverrides = [
            {
                attr: 'data-linewrap',
                setting: 'lineWrap',
                type: 'boolean',
            },
            {
                attr: 'data-animate',
                setting: 'animate',
                type: 'boolean',
            },
            {
                attr: 'data-jptremote',
                setting: 'remoteSrc',
                type: 'string',
            },
        ];

        // Pull from element itself or child
        const elementsToPullFrom = [element];
        if (element.childElementCount > 0) {
            // ideally, `pre` > `code`
            // @ts-ignore
            elementsToPullFrom.push(element.children[0]);
        }

        for (let e = 0; e < elementsToPullFrom.length; e++) {
            const currElement = elementsToPullFrom[e];
            for (let x = 0; x < allowedOverrides.length; x++) {
                const mapping = allowedOverrides[x];

                // If element has attributes that match allowed setting overrides...
                if (currElement.hasAttribute(mapping.attr) && currElement.getAttribute(mapping.attr) !== '') {
                    let rawVal = /** @type {string} */ (currElement.getAttribute(mapping.attr));
                    /** @type {InstanceConfig[keyof InstanceConfig] | number} */
                    let decodedVal;
                    let block = false;
                    if (mapping.type === 'boolean') {
                        rawVal = rawVal.toUpperCase();
                        decodedVal = rawVal === 'TRUE' ? true : false;
                    } else if (mapping.type === 'number') {
                        try {
                            decodedVal = parseFloat(rawVal);
                        } catch (e) {
                            block = true;
                        }
                    } else if (mapping.type === 'object') {
                        try {
                            decodedVal = JSON.parse(rawVal);
                        } catch (e) {
                            block = true;
                        }
                    } else {
                        decodedVal = rawVal;
                    }
                    // Update setting
                    if (!block) {
                        // @ts-ignore
                        config[mapping.setting] = decodedVal;
                    }
                }
            }
        }
        return config;
    }

    /**
     * Fix code blocks that are not properly setup to be formatted by Prism
     * @param {HTMLElement} elem
     */
    autoFix(elem) {
        const preElem = elem.nodeName === 'PRE' ? elem : elem.querySelector('pre');

        // Pandoc type output --> `<pre class="js"><code></code></pre>`
        if (preElem) {
            let langAbbrev;
            const codeElem = preElem.querySelector('code:nth-child(1):not([class*="lang-"]');

            for (const className of preElem.classList) {
                if (LangKeys.includes(className)) {
                    langAbbrev = className;
                    break;
                }
            }

            if (!langAbbrev || !codeElem) {
                return false;
            }

            // Copy language class to `<code>` elem and re-init
            codeElem.classList.add(`language-${langAbbrev}`);
            this.highlight(codeElem);
            return true;
        }

        return false;
    }

    /**
     * @param {ToolbarInstance} instance
     */
    toggleCollapsed(instance) {
        if (instance.collapsed === false) {
            // Save info about the expanded state to be used later if returning
            const originalHeight = getComputedStyle(instance.codeElem).height;
            instance.codeElem.setAttribute('data-jexpandedheight', originalHeight);
            instance.codeElem.setAttribute('data-jexpandedpadding', getComputedStyle(instance.codeElem).padding);
            instance.codeElem.setAttribute('data-jexpandedoverflow', getComputedStyle(instance.codeElem).overflow);
            // Now collapse the code block down
            instance.codeElem.style.height = originalHeight;
            // Need a delay after setting height manually to get transition animation to work
            setTimeout(function () {
                instance.codeElem.style.height = '3px';
                instance.codeElem.style.padding = '3px';
                instance.codeElem.style.overflow = 'hidden';
            }, 100);
            // Update state
            instance.collapsed = true;
        } else {
            // Restore height, padding, and overflow
            instance.codeElem.style.height = instance.codeElem.getAttribute('data-jexpandedheight') || '';
            instance.codeElem.style.padding = instance.codeElem.getAttribute('data-jexpandedpadding') || '';
            instance.codeElem.style.overflow = instance.codeElem.getAttribute('data-jexpandedoverflow') || '';
            // Update state
            instance.collapsed = false;
        }
        // Update toolbar button
        assertElem(instance.toolbarElem.querySelector('.prismTbTgCollap')).setAttribute(
            'data-collapsed',
            instance.collapsed.toString()
        );
    }

    /**
     *
     * @param {ToolbarInstance} instance
     * @param {MouseEvent} evt
     */
    copyCode(instance, evt) {
        let success = false;
        // Check for ClipboardJS
        /* istanbul ignore next */
        if (this.getHasClipboardJS() === true) {
            // Do nothing, since ClipboardJS is initialized elsewhere and handles via HTML attributes
            success = true;
        } else {
            const text = instance.codeElem.innerText;

            // browser API
            if (navigator.clipboard) {
                try {
                    navigator.clipboard.writeText(text);
                    success = true;
                } catch (err) {
                    console.error(`Error copying to clipboard`, err);
                }
            }
        }

        // If failed to copy to clipboard, pre-select text and alert user
        if (!success) {
            selectElementText(instance.codeElem, window);
            this.showMessage(instance, 'Text is selected for easy copying!');
        } else {
            this.showMessage(instance, 'Copied to clipboard!');
        }
    }

    getHasClipboardJS() {
        return typeof window.ClipboardJS === 'function';
    }

    /**
     *
     * @param {ToolbarInstance} instance
     */
    toggleMaximize(instance) {
        if (instance.isMaximized !== true) {
            // Construct a fullscreen wrapper
            const fullscreenWrapper = document.createElement('div');
            fullscreenWrapper.className = 'jFscrnWrp jPTbStyl';
            // Create toolbar
            fullscreenWrapper.innerHTML = `<div class="jFullscreenToolbar">
                  <div class="jFscreenTBtnWrp">
                      <button class="jFullscreenCloseBtn">X</button>
                  </div>
              </div>`;
            // Create code wrapper
            const codeWrapper = document.createElement('div');
            codeWrapper.className = 'jCodeWrapper jAutCtPrnt';
            // Copy actual code element to code wrapper
            const codeClone = instance.codeElem.cloneNode(true);
            // Append code clone to wrapper
            codeWrapper.appendChild(codeClone);
            fullscreenWrapper.appendChild(codeWrapper);
            // Append fullscreen wrapper to end of page
            document.getElementsByTagName('body')[0].appendChild(fullscreenWrapper);
            // Attach event listeners for closing out of fullscreen
            // @ts-ignore
            fullscreenWrapper.querySelector('.jFullscreenCloseBtn').addEventListener('click', () => {
                this.toggleMaximize(instance);
            });
            codeWrapper.addEventListener('click', (evt) => {
                // Make sure click was NOT on code block, and was on the backdrop itself
                const target = /** @type {typeof codeWrapper} */ (evt.target);
                if (target.classList.contains('jCodeWrapper')) {
                    this.toggleMaximize(instance);
                }
            });
            // Update state
            instance.isMaximized = true;
            instance.fullscreenWrapper = fullscreenWrapper;
        } else {
            if (instance.fullscreenWrapper) {
                instance.fullscreenWrapper.remove();
            }
            instance.fullscreenWrapper = undefined;
            instance.isMaximized = false;
        }
    }

    /**
     * @param {ToolbarInstance} instance
     */
    toggleLineWrap(instance) {
        const oldIsLineWrapped = instance.codeElem.classList.contains('jCodeForceLineWrap');
        instance.codeElem.classList.toggle('jCodeForceLineWrap');
        assertElem(instance.toolbarElem.querySelector('.jPTbrTogLWrap')).setAttribute(
            'data-linewrapon',
            (!oldIsLineWrapped).toString()
        );
    }

    /**
     * @param {HTMLButtonElement | HTMLElement} buttonElement
     */
    animateButtonClick = function (buttonElement) {
        buttonElement.classList.add('justClicked');
        setTimeout(function () {
            buttonElement.classList.remove('justClicked');
        }, 400);
    };

    /**
     * Attaches event listeners to all instances that need them set up.
     */
    attachEventListeners() {
        const _this = this;
        this.iterator((instance) => {
            if (instance.eventsAttached === false) {
                // Line wrap button
                const lineWrapButton = /** @type {HTMLElement} */ (
                    instance.toolbarElem.querySelector('.jLineWrapButton')
                );
                lineWrapButton.addEventListener('click', function (evt) {
                    _this.toggleLineWrap(instance);
                    _this.animateButtonClick(lineWrapButton);
                });
                // -/+ collapse button
                const collapseButton = /** @type {HTMLElement} */ (
                    instance.toolbarElem.querySelector('.prismTbTgCollap')
                );
                collapseButton.addEventListener('click', function (evt) {
                    _this.toggleCollapsed(instance);
                    _this.animateButtonClick(collapseButton);
                });
                // Copy button
                const copyButton = /** @type {HTMLElement} */ (instance.toolbarElem.querySelector('.jCopyButton'));
                copyButton.addEventListener('click', function (evt) {
                    _this.copyCode(instance, evt);
                    _this.animateButtonClick(copyButton);
                });
                // Maximize button
                const maximizeButton = /** @type {HTMLElement} */ (
                    instance.toolbarElem.querySelector('.jMaximizeButton')
                );
                maximizeButton.addEventListener('click', function (evt) {
                    _this.toggleMaximize(instance);
                    _this.animateButtonClick(maximizeButton);
                });
                instance.eventsAttached = true;
            }
        });
    }

    /**
     * Iterates over all PrismToolbar "Instances" and passes an object representation of the instance to the callback
     * @param {(instance: ToolbarInstance) => void} callback - the function that will receive the instance
     */
    iterator(callback) {
        callback = callback || (() => {});
        for (let x = 0; x < this.domInstances.length; x++) {
            callback(this.domInstances[x]);
        }
    }

    /**
     * Flash a temporary message in the toolbar UI
     * @param {ToolbarInstance} instance
     * @param {string} message
     * @param {number} [OPT_delay]
     */
    showMessage(instance, message, OPT_delay) {
        const delayMs = typeof OPT_delay === 'number' ? OPT_delay : 1000;
        const messageContainer = /** @type {HTMLElement} */ (instance.toolbarElem.querySelector('.jMessage'));
        messageContainer.classList.remove('jHidden');
        messageContainer.innerText = message;
        setTimeout(function () {
            messageContainer.innerText = '';
            messageContainer.classList.add('jHidden');
        }, delayMs);
    }

    /**
     * Parse a remote code URL and load, if possible
     * @param {ToolbarInstance} instance
     * @param {string} src
     */
    async loadRemoteCode(instance, src) {
        /** @type {Promise<any>[]} */
        const promiseArr = [];
        let rawCodeLink = src;
        let userLink = src;
        let matched = false;
        let done = false;

        this.setRemoteSrcDisplay(instance, src);

        // Test for raw reversable Github link
        const rawGhPatt = /(https{0,1}:\/\/)raw\.githubusercontent\.com(\/[^\/]+\/[^\/]+)(\/.*)/i;
        if (!matched && rawGhPatt.test(src)) {
            matched = true;
            const parts = [...(src.match(rawGhPatt) || [])];
            userLink = `${parts[1]}github.com${parts[2]}/blob${parts[3]}`;
        }

        // Test for blob Github link
        const blobGhPatt = /(https{0,1}:\/\/)github\.com(\/[^\/]+\/[^\/]+)\/blob(\/.*)/i;
        if (!matched && blobGhPatt.test(src)) {
            matched = true;
            const parts = [...(src.match(blobGhPatt) || [])];
            rawCodeLink = `${parts[1]}raw.githubusercontent.com${parts[2]}${parts[3]}`;
            userLink = src;
        }

        // Test for generic Gist link - these can contain nested files
        const rawGistPatt = /(https{0,1}:\/\/)gist\.github\.com\/([^\/]+)\/([^\/]+)$/i;
        if (!matched && rawGistPatt.test(src)) {
            matched = true;
            done = true;
            const gistId = (src.match(rawGistPatt) || [])[3];
            try {
                const ghRes = await fetch(`https://api.github.com/gists/${gistId}`);
                const data = await ghRes.json();
                /** @type {Array<import('./types').GhGistFile>} */
                const files = Object.values(data.files);

                // We need to:
                // - destroy instance, and replace with multiple elements, one
                // per gist sub-file
                // - wrap those elements in a container
                // - Initialize those elements, as instances, with toolbar
                // and highlighting
                // - Mark those elemnts / instances as remote code, with URLs

                // Remove instance that is going to be replaced by multiple
                this.domInstances = this.domInstances.filter((i) => i.codeElem !== instance.codeElem);
                instance.toolbarElem.remove();

                // Create container to hold all files
                const container = document.createElement('div');
                container.classList.add(`${PkgPrefix}MultiContainer`);
                instance.codeElem.replaceWith(container);

                // Create banner / header that tells user all below belong to
                // same gist
                if (files.length > 1) {
                    const banner = document.createElement('p');
                    banner.classList.add(`${PkgPrefix}Banner`);
                    banner.innerHTML = `Files in Github Gist (${getNewTabLink(src, gistId)}):`;
                    container.appendChild(banner);
                }

                // Inject each file into container, with highlighting
                files.forEach((f) => {
                    const languageStr = `language-${f.language.toLocaleLowerCase()}`;
                    const pre = document.createElement('pre');
                    pre.classList.add(languageStr);
                    pre.innerHTML = `<code class="${languageStr}">${basicHtmlEscape(f.content)}</code>`;
                    container.append(pre);
                    promiseArr.push(
                        (async () => {
                            const subInstance = await this.initOnElem(pre);
                            this.highlight(subInstance);
                            this.setRemoteSrcDisplay(subInstance, f.raw_url, f.filename);
                        })()
                    );
                });
            } catch (e) {
                console.error('Failed to load GH Gist', e);
            }
        }

        if (!done) {
            await this.fetchAndLoadIntoInstance(instance, rawCodeLink, userLink);
        }

        await Promise.all(promiseArr);
    }

    /**
     * Fetch a URL that returns raw code, and display the code in an instance
     * @param {ToolbarInstance} instance
     * @param {string} codeSrc Where the raw code text can be fetched from
     * @param {string} [userLink] Where the user should be taken to if they want to view the original source code in Github / VC
     */
    async fetchAndLoadIntoInstance(instance, codeSrc, userLink) {
        this.showMessage(instance, 'Loading remote code...', 2000);
        this.setInnerContent(instance, `loading ${codeSrc} ...`, false);
        this.setRemoteSrcDisplay(instance, userLink || codeSrc);

        const fail = () => {
            this.showMessage(instance, 'Remote URL could not be reached :(', 5000);
            this.setInnerContent(
                instance,
                `<span style="background-color:red;">Remote load failed. Remote link: ${getNewTabLink(
                    codeSrc,
                    codeSrc,
                    'color:white !important;'
                )}</span>`,
                false
            );
        };

        /** @type {Response | null} */
        let response = null;
        let rawRemoteCode = '';
        let success = false;

        try {
            response = await fetch(codeSrc);
            if (response.status === 200) {
                rawRemoteCode = await response.text();
                this.setInnerContent(instance, basicHtmlEscape(rawRemoteCode), true, true);
                this.showMessage(instance, 'Remote URL loaded!');
                success = true;
            }
        } catch (e) {
            success = false;
        }

        if (!success) {
            fail();
        }

        return {
            success,
            response,
            rawRemoteCode,
        };
    }

    /**
     * Display a remote code URL notice in the toolbar
     *  - Set url to null to hide
     * @param {ToolbarInstance} instance
     * @param {string | null} url
     * @param {string} [linkText]
     */
    setRemoteSrcDisplay(instance, url, linkText) {
        // Display link to remote
        const remoteSrcDisplayElem = /** @type {HTMLElement} */ (
            instance.toolbarElem.querySelector('.jRemoteSrcDisplay')
        );
        if (!!url) {
            remoteSrcDisplayElem.classList.remove('jHidden');
            remoteSrcDisplayElem.innerHTML = `Remote Source: ${getNewTabLink(url, linkText)}`;
        } else {
            remoteSrcDisplayElem.classList.add('jHidden');
        }
    }

    /**
     *
     * @param {ToolbarInstance} instance
     * @param {string} content
     * @param {boolean} [OPT_reHighlight]
     * @param {boolean} [OPT_forceIntoCodeEleme]
     */
    setInnerContent(instance, content, OPT_reHighlight, OPT_forceIntoCodeEleme) {
        const forceCodeElem = typeof OPT_forceIntoCodeEleme === 'boolean' ? OPT_forceIntoCodeEleme : false;
        const reHighlight = typeof OPT_reHighlight === 'boolean' ? OPT_reHighlight : true;

        let contentTarget = instance.codeElem;

        // See if <code></code> is contained
        const innerCodeElem = instance.codeElem.querySelector('code');
        if (innerCodeElem) {
            contentTarget = innerCodeElem;
        } else if (instance.codeElem.nodeName === 'PRE' && forceCodeElem) {
            instance.codeElem.innerHTML = '';
            contentTarget = document.createElement('code');
            instance.codeElem.appendChild(contentTarget);
        }

        contentTarget.innerHTML = content;

        if (reHighlight) {
            this.highlight(instance);

            // Special: Remove spurious first line indent caused by HTML pre src
            instance.codeElem.innerHTML = instance.codeElem.innerHTML.replace(/^\s+/g, '');
        }
    }

    /**
     * Attempt to highlight (or re-highlight) code syntax with Prism
     * @param {ToolbarInstance | HTMLElement | Element} instanceOrElem
     */
    highlight(instanceOrElem) {
        const elem = 'codeElem' in instanceOrElem ? instanceOrElem.codeElem : instanceOrElem;
        if (typeof window.Prism === 'object') {
            window.Prism.highlightElement(elem);
        }
    }
}

export default PrismToolbar;
