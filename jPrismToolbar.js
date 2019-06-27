/**
 * @file Custom Toolbar for PrismJS Code Embeds
 * @author Joshua Tzucker
 * @copyright Joshua Tzucker 2019
 * @license MIT
 */

var PrismToolbar = (function(){
    /**
    * Private Functions
    */
    function getToolbarHtml(){
        function getFallbackButtonCode(fallbackText){
            return (
                '<div class="jAutoCenterParent jIconWrapper jIconsSolidBackground">' +
                    '<div class="jFallback">' + fallbackText + '</div>' +
                '</div>'
            );
        }
        function getThirdPartyIconCode(innerIconCode){
            return (
                '<div class="jAutoCenterParent jIconWrapper jIconsSolidBackground">' +
                    innerIconCode +
                '</div>'
            );
        }
        var lineWrapButtonCode = '' +
        '<div class="jPrismToolbarToggleLineWrap jToolbarButton jToolbarButtonShowPointer jLineWrapButton jHasFallbackIcons jShadowLight" title="Toggle Line Wrap" data-linewrapon="false">' +
            // Fallback
            getFallbackButtonCode('break') +
            // Third Party Icons
            getThirdPartyIconCode('<i class="fa fa-outdent jIconsSolidBackground" aria-hidden="true"></i>') +
            getThirdPartyIconCode('<i class="material-icons left">wrap_text</i>') +
        '</div>';
        var copyButtonCode = '' +
        '<div class="jToolbarButton jCopyButton jHasFallbackIcons jShadowLight" title="Copy code to clipboard">' +
            // Fallback
            getFallbackButtonCode('copy') +
            // Third Party Icons
            getThirdPartyIconCode('<i class="material-icons left">content_copy</i>') +
            getThirdPartyIconCode('<i class="fa fa-clone jIconsSolidBackground" aria-hidden="true"></i>') +
        '</div>';
        var maximizeButtonCode = '' +
        '<div class="jToolbarButton jToolbarButtonShowPointer jMaximizeButton jHasFallbackIcons jShadowLight" title="Fullscreen code view">' +
            // Fallback
            getFallbackButtonCode('max') +
            // Third Party Icons
            getThirdPartyIconCode('<i class="material-icons left">fullscreen</i>') +
            getThirdPartyIconCode('<i class="fa fa-search-plus jIconsSolidBackground" aria-hidden="true"></i>') +
        '</div>';
        return (
            '<div class="jToolbar jShadow">' +
                '<div class="jContent">' +
                    '<div class="jLeftSide">' +
                        '<div class="jMessageWrapper">' +
                            '<div class="jMessage jHidden"></div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="jRightSide">' +
                        lineWrapButtonCode +
                        copyButtonCode +
                        '<div class="prismToolbarToggleCollapse jToolbarButton jToolbarButtonShowPointer jShadowLight" data-collapsed="false" title="Toggle collapse of code embed">' +
                            '<div class="isNotCollapsed jAutoCenterParent"><div>-</div></div>' +
                            '<div class="isCollapsed jAutoCenterParent"><div>+</div></div>' +
                        '</div>' +
                        maximizeButtonCode +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    }

    function getToolbarCss(){
        return (
            '.jToolbarButton {' +
                'border: 1px solid black;' +
                'width: 36px;' +
                'height: 36px;' +
                'text-align: center;' +
                'font-size: 3rem;' +
                'display: inline-block;' +
                'float: left;' +
                'position: relative;' +
                'margin-left: 4px;' +
                'overflow: hidden;' +
                'margin-bottom: 6px;' +
            '}' +
            '.jToolbarWrapper {' +
                'width: 100%;' +
            '}' +
            '.jToolbar {' +
                'background-color: white;' +
                'border-left: 1px solid black;' +
                'border-top: 1px solid black;' +
                'border-right: 1px solid black;' +
                'padding: 10px 0px;' +
                'min-height: 55px;' +
                'border-top-left-radius: 15px;' +
                'border-top-right-radius: 15px;' +
                'margin-bottom: -0.6em;' +
                'height: auto;' +
                'position: relative;' +
            '}' +
            '.jToolbarWrapper .jRightSide {' +
                'position: absolute;' +
                'right: 10px;' +
                'top: 10px;' +
                'min-width: 120px;' +
                'max-width: 80%;' +
            '}' +
            '.jToolbarWrapper .jLeftSide {' +
                'max-width: 50%;' +
            '}' +
            '.prismToolbarToggleCollapse[data-collapsed=\'false\'] .isCollapsed {' +
                'display:none;' +
            '}' +
            '.prismToolbarToggleCollapse[data-collapsed=\'false\'] .isNotCollapsed {' +
                'display:block;' +
            '}' +
            '.prismToolbarToggleCollapse[data-collapsed=\'true\'] .isCollapsed {' +
                'display:block;' +
            '}' +
            '.prismToolbarToggleCollapse[data-collapsed=\'true\'] .isNotCollapsed {' +
                'display:none;' +
            '}' +
            '.jToolbarWrapper {' +
                'width:100%;' +
            '}' +
            '.jToolbarWrapper .jShadow {' +
                '-webkit-box-shadow: 0 16px 24px 2px rgba(0,0,0,0.14), 0 6px 30px 5px rgba(0,0,0,0.12), 0 8px 10px -7px rgba(0,0,0,0.2);' +
                'box-shadow: 0 16px 24px 2px rgba(0,0,0,0.14), 0 6px 30px 5px rgba(0,0,0,0.12), 0 8px 10px -7px rgba(0,0,0,0.2);' +
            '}' +
            '.jToolbarWrapper .jShadowLight {' +
                '-webkit-box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3);' +
                'box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3);' +
            '}' +
            '.jToolbarButton > img {' +
                'width: 100%;' +
                'height: 100%;' +
            '}' +
            '.jPrismToolbarStyled .jAutoCenterParent {' +
                'position: relative;' +
            '}' +
            '.jAutoCenterChild, .jAutoCenterParent > * {' +
                'position: absolute;' +
                'top: 50%;' +
                'left: 50%;' +
                'transform: translate(-50%, -50%);' +
            '}' +
            '.jToolbarWrapper .jContent {' +
                'width: 100%;' +
                'height: 100%;' +
            '}' +
            '.jPrismToolbarStyled .jCopyButton .jFallback {' +
                'font-size: 1rem;' +
            '}' +
            '.jToolbarButton, .jPrismToolbarStyled .jIconsSolidBackground {' +
                'webkitTransition: all 300ms;' +
                'transition: all 300ms;' +
            '}' +
            '.jPrismToolbarStyled .jIconsSolidBackground {' +
                'background-color: white;' +
                'color: black !important;' +
            '}' +
            '.jToolbarButton.justClicked .jIconsSolidBackground, .jToolbarButton.justClicked {' +
                'background-color: black !important;' +
                'color: white !important;' +
            '}' +
            '.jHasFallbackIcons > i, .jHasFallbackIcons > .jFallback, .jIconWrapper {' +
                'position: absolute !important;' +
                'width: 36px;' +
                'height: 36px;' +
                'text-align: center;' +
                'font-size: large;' +
                'top: 0px !important;' +
                'left: 0px !important;' +
                
            '}' +
            '.prismToolbarToggleCollapse {' +
                'display: inline-block;' +
                'cursor: pointer;' +
            '}' +
            '.jToolbarButtonShowPointer {' +
                'cursor: pointer;' +
            '}' +
            '.jPrismToolbarStyled .jCopyButton {' +
                'cursor: copy;' +
            '}' +
            '.jPrismToolbarToggleLineWrap[data-linewrapon="true"] .jIconsSolidBackground {' +
                'background-color: #cfffcf;' +
            '}' +
            '.jFullscreenWrapper {' +
                'width: 100%;' +
                'height: 100%;' +
                'position: fixed;' +
                'background-color: rgba(0, 0, 0, 0.91);' +
                'z-index: 999;' +
                'top: 0px;' +
                'left: 0px;' +
                'max-width: 100%;' +
            '}' +
            '.jFullscreenWrapper .jCodeWrapper {' +
                'height: 94%;' +
                'width: 100%;' +
            '}' +
            '.jFullscreenToolbar {' +
                'width: 100%;' +
                'min-height: 6%;' +
                'background-color: black;' +
            '}' +
            '.jFullscreenToolbarButtonWrapper {' +
                'text-align: center;' +
                'width: 100%;' +
                'min-height: 6%;' +
                'padding-top: 2.5%;' +
                'position: absolute;' +
                'background-color: black;' +
            '}' +
            '.jFullscreenToolbarButton {' +
                'color: white;' +
                'font-size: 3rem;' +
                'cursor: pointer;' +
            '}' +
            '.jFullscreenWrapper .jCodeWrapper > * {' +
                'border: 2px solid white;' +
                'width: 96% !important;' +
                'height : auto !important;' +
                'max-height: 93% !important;' +
                'overflow-y: scroll;' +
                'margin: 0px;' +
            '}' +
            '.prismToolbarToggleCollapse > .jAutoCenterParent {' +
                'width: 100%;' +
                'height: 100%;' +
            '}' +
            '.jMessageWrapper {' +
                'width: auto;' +
            '}' +
            '.jPrismToolbarStyled .jMessage {' +
                'margin-left: 10px;' +
                'margin-top: 3px;' +
                'font-family: monospace;' +
                'font-style: italic;' +
                'font-weight: bolder;' +
                'color: black;' +
                'border: 1px dashed black;' +
                'padding: 4px;' +
                'text-align: center;' +
            '}' +
            '.jFullscreenWrapper .jHidden, .jToolbarWrapper .jHidden {' +
                'display: none !important;' +
            '}' +
            '.jCodeForceLineWrap, .jCodeForceLineWrap code {' +
                'white-space: pre-wrap;' +
            '}' + 
            '@media only screen and (max-width: 360px){' +
                '.jToolbar {' +
                    'min-height: 95px;' +
                '}' +
                '.jToolbarWrapper .jLeftSide {' +
                    'display: none;' +
                '}' +
            '}'
        );
    }

    /**
     * Private members
     */
    var _inputSettings;
    var _injectedStyles = false;

    /**
    * Constructor and Public Functions
    */
    function PrismToolbarConstructor(inputSettings){
        _inputSettings = (inputSettings || {});
        // Controls where the toolbar is injected and if your code should be wrapped and then toolbar injected - usually yes
        this.domInstances = [];
        this.targetElementsArr = [];
        this.selector = typeof(_inputSettings.selector)==='string' ? _inputSettings.selector : false;
        this.settings = {
            wrapCombo:  typeof(_inputSettings.wrapCombo)==='boolean' ? _inputSettings.wrapCombo : true,
            animate: typeof(_inputSettings.animate)==='boolean' ? _inputSettings.animate : true,
            lineWrap: typeof(_inputSettings.lineWrap)==='boolean' ? _inputSettings.lineWrap : false
        }
    }
    /**
     * Force jPrimsToolbar to evaluate inputs to determine which elements to target for adding the toolbar to
     */
    PrismToolbarConstructor.prototype.populateListOfTargets = function(){
        // Reset
        var _inputTargetElementsArr = [];
        this.targetElementsArr = [];
        // Check for single element or NodeList passed as target option
        if (_inputSettings.targetElements && typeof(_inputSettings.targetElements.entries)==='function'){
            // NodeList
            _inputTargetElementsArr  = _inputSettings.targetElements;
        }
        else if (_inputSettings.targetElements && typeof(_inputSettings.targetElements.nodeName)==='string'){
            // Single element
            _inputTargetElementsArr  = [_inputSettings.targetElements];
        }
        else if (this.selector && typeof(this.selector)==='string'){
            // String CSS selector
            _inputTargetElementsArr = document.querySelectorAll(this.selector);
        }
        // Pre-filter targets
        for (var x=0; x<_inputTargetElementsArr.length; x++){
            var currTarget = _inputTargetElementsArr[x];
            // preference is for <pre></pre>
            if (currTarget.nodeName==='PRE'){
                this.targetElementsArr.push(currTarget);
            }
            else if (currTarget.nodeName==='CODE' && currTarget.parentElement.nodeName==='PRE'){
                this.targetElementsArr.push(currTarget.parentElement);
            }
            else {
                // Invalid element passed
            }
        }
    }
    PrismToolbarConstructor.prototype.getPerInstanceConfig = function(element){
        // Copy settings from main setup
        var config = this.settings;
        // let inline HTML attributes override settings
        var allowedOverrides = [
            {
                attr: "data-linewrap",
                setting: "lineWrap",
                type: "boolean"
            },
            {
                attr: "data-animate",
                setting: "animate",
                type: "boolean"
            }
        ]
        // Pull from element itself or child
        var elementsToPullFrom = [element];
        if (element.childElementCount > 0){
            elementsToPullFrom.push(element.children[0]);
        }
        for (var e=0; e<elementsToPullFrom.length; e++){
            var currElement = elementsToPullFrom[e];
            for (var x=0; x<allowedOverrides.length; x++){
                var mapping = allowedOverrides[x];
                if (currElement.hasAttribute(mapping.attr) & currElement.getAttribute(mapping.attr)!==''){
                    var rawVal = currElement.getAttribute(mapping.attr);
                    var decodedVal;
                    var block = false;
                    if (mapping.type==='boolean'){
                        decodedVal = (rawVal==='TRUE'||rawVal==='true') ? true : false;
                    }
                    if (mapping.type==='number'){
                        try {
                            decodedVal = parseFloat(rawVal);
                        }
                        catch(e){
                            block = true;
                        }
                    }
                    if (mapping.type==='object'){
                        try {
                            decodedVal = JSON.parse(rawVal);
                        }
                        catch(e){
                            block = true;
                        }
                    }
                    else {
                        decodedVal = rawVal;
                    }
                    // Update setting
                    if (!block){
                        config[mapping.setting] = decodedVal;
                    }
                }
            }
        }
        return config;
    }
    PrismToolbarConstructor.prototype.init = function(){
        this.populateListOfTargets();
        if (this.targetElementsArr.length > 0){
            if (!_injectedStyles){
                var styleBlock = document.createElement('style');
                styleBlock.innerText = getToolbarCss();
                document.getElementsByTagName('body')[0].appendChild(styleBlock);
                _injectedStyles = true;
            }
            // Main toolbar injector iterator
            for (var x=0; x<this.targetElementsArr.length; x++){

                // Get per-instance config
                var elem = this.targetElementsArr[x];
                var config = this.getPerInstanceConfig(elem);

                // Now, in this context, elem is the code element (pre usually)
                var toolbarElem = document.createElement('div');
                toolbarElem.className = 'jToolbarWrapper jPrismToolbarStyled';
                toolbarElem.innerHTML = getToolbarHtml();

                // Check to see if <pre></pre> is already wrapped with toolbar wrapper - if not, wrap it
                // debugger;
                if (!elem.parentNode.classList.contains('code-toolbar') && config.wrapCombo){
                    var wrapper = document.createElement('div');
                    wrapper.className = 'code-toolbar';
                    // Add the wrapper as a sibling, before, of the code container
                    elem.parentNode.insertBefore(wrapper,elem);
                    // move into wrapper
                    wrapper.appendChild(elem);
                }
                // Toolbar should be added BEFORE <pre></pre>, not inside it
                elem.parentNode.insertBefore(toolbarElem,elem);

                // Directly add transition CSS to elements
                if (config.animate){
                    elem.style.webkitTransition = 'all 1s';
                    elem.style.transition = 'all 1s';
                }

                // Generate ID for code element and set as target of copy button
                var codeElemId = elem.getAttribute('id');
                var copyButton = toolbarElem.querySelector('.jCopyButton');
                if (!codeElemId || codeElemId===''){
                    codeElemId = 'jCodeElem_' + x;
                    elem.setAttribute('id',codeElemId);
                }
                copyButton.setAttribute('data-clipboard-target','#' + codeElemId);

                // See if line-wrap should be turned on to start with
                if (config.lineWrap){
                    elem.classList.add('jCodeForceLineWrap');
                    toolbarElem.querySelector('.jPrismToolbarToggleLineWrap').setAttribute('data-linewrapon',true);
                }

                // Wrap up all properties into a nice "instance" object
                var currInstance = {
                    container : elem.parentNode,
                    codeElem : elem,
                    toolbarElem : toolbarElem,
                    collapsed : false,
                    copyButton : copyButton,
                    clipboardInitialized : false,
                    eventsAttached : false,
                    config : config
                };

                // Save
                this.domInstances.push(currInstance);
            }

            // Attach event listeners
            this.attachEventListeners();

            // Init ClipboardJS
            if (this.getHasClipboardJS()===true){
                this.initClipboardJS();
            }
            else {
                setTimeout(function(){
                    this.initClipboardJS();
                }.bind(this),2000);
            }
        }
        else {
            console.warn('init was called, but no suitable targets could be found');
        }
        return this;
    }
    PrismToolbarConstructor.prototype.autoInit = function(){
        this.selector = 'pre > code[class*="language-"]';
        this.settings.wrapCombo = false;
        this.init();
    };
    PrismToolbarConstructor.prototype.initClipboardJS = function(){
        this.iterator(null,function(instance){
            if (instance.clipboardInitialized===false && this.getHasClipboardJS()===true){
                instance.ClipboardJSInstance = new ClipboardJS(instance.copyButton);
                instance.ClipboardJSInstance.on('success',function(e){
                    console.log(e);
                });
                instance.ClipboardJSInstance.on('error',function(e){
                    console.warn('issue with ClipboardJS');
                    console.warn(e);
                });
            }
        }.bind(this));
    };
    PrismToolbarConstructor.prototype.destroy = function(){
        //@TODO
    };
    PrismToolbarConstructor.prototype.toggleCollapsed = function(instance){
        if (instance.collapsed === false){
            // Save info about the expanded state to be used later if returning
            var originalHeight = getComputedStyle(instance.codeElem).height;
            instance.codeElem.setAttribute('data-jexpandedheight',originalHeight);
            instance.codeElem.setAttribute('data-jexpandedpadding',getComputedStyle(instance.codeElem).padding);
            instance.codeElem.setAttribute('data-jexpandedoverflow',getComputedStyle(instance.codeElem).overflow);
            // Now collapse the code block down
            instance.codeElem.style.height = originalHeight;
            // Need a delay after setting height manually to get transition animation to work
            setTimeout(function(){
                instance.codeElem.style.height = '3px';
                instance.codeElem.style.padding = '3px';
                instance.codeElem.style.overflow = 'hidden';
            },100);
            // Update state
            instance.collapsed = true;
        }
        else {
            // Restore height, padding, and overflow
            instance.codeElem.style.height = instance.codeElem.getAttribute('data-jexpandedheight');
            instance.codeElem.style.padding = instance.codeElem.getAttribute('data-jexpandedpadding');
            instance.codeElem.style.overflow = instance.codeElem.getAttribute('data-jexpandedoverflow');
            // Update state
            instance.collapsed = false;
        }
        // Update toolbar button
        instance.toolbarElem.querySelector('.prismToolbarToggleCollapse').setAttribute('data-collapsed',instance.collapsed.toString());
    };
    PrismToolbarConstructor.prototype.copyCode = function(instance){
        // https://stackoverflow.com/a/2838358
        function selectElementText(el, win) {
            win = win || window;
            var doc = win.document, sel, range;
            if (win.getSelection && doc.createRange) {
                sel = win.getSelection();
                range = doc.createRange();
                range.selectNodeContents(el);
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (doc.body.createTextRange) {
                range = doc.body.createTextRange();
                range.moveToElementText(el);
                range.select();
            }
        }
        // Check for ClipboardJS
        if (this.getHasClipboardJS()===true){
            // Do nothing, since ClipboardJS is initialized elsewhere and handles via HTML attributes
            this.showMessage(instance,'Copied to clipboard!');
        }
        else {
            selectElementText(instance.codeElem,window);
            this.showMessage(instance,'Text is selected for easy copying!');
        }
    }
    PrismToolbarConstructor.prototype.getHasClipboardJS = function(){
        return typeof(window.ClipboardJS)==='function';
    }
    PrismToolbarConstructor.prototype.toggleMaximize = function(instance){
        var _this = this;
        if (instance.isMaximized!==true){
            // Construct a fullscreen wrapper
            var fullscreenWrapper = document.createElement('div');
            fullscreenWrapper.className = 'jFullscreenWrapper jPrismToolbarStyled';
            // Create toolbar
            fullscreenWrapper.innerHTML = '' +
                '<div class="jFullscreenToolbar">' +
                    '<div class="jFullscreenToolbarButtonWrapper">' +
                        '<div class="jFullscreenToolbarButton jCloseButton">X</div>' +
                    '</div>' +
                '</div>';
            // Create code wrapper
            var codeWrapper = document.createElement('div');
            codeWrapper.className = 'jCodeWrapper jAutoCenterParent';
            // Copy actual code element to code wrapper
            var codeClone = instance.codeElem.cloneNode(true);
            // Append code clone to wrapper
            codeWrapper.appendChild(codeClone);
            fullscreenWrapper.appendChild(codeWrapper);
            // Append fullscreen wrapper to end of page
            document.getElementsByTagName('body')[0].appendChild(fullscreenWrapper);
            // Attach event listeners for closing out of fullscreen
            fullscreenWrapper.querySelector('.jCloseButton').addEventListener('click',function(evt){
                _this.toggleMaximize(instance);
            });
            codeWrapper.addEventListener('click',function(evt){
                // Make sure click was NOT on code block, and was on the backdrop itself
                if(evt.target.classList.contains('jCodeWrapper')){
                    _this.toggleMaximize(instance);
                }
            });
            // Update state
            instance.isMaximized = true;
            instance.fullscreenWrapper = fullscreenWrapper;
        }
        else {
            instance.fullscreenWrapper.remove();
            instance.fullscreenWrapper = undefined;
            instance.isMaximized = false;
        }
    };

    /**
     * Toggles line wrap for a specific prism instance
     */
    PrismToolbarConstructor.prototype.toggleLineWrap = function(instance){
        var oldIsLineWrapped = instance.codeElem.classList.contains('jCodeForceLineWrap');
        instance.codeElem.classList.toggle('jCodeForceLineWrap');
        instance.toolbarElem.querySelector('.jPrismToolbarToggleLineWrap').setAttribute('data-linewrapon',(!oldIsLineWrapped).toString());
    };

    PrismToolbarConstructor.prototype.animateButtonClick = function(buttonElement){
        buttonElement.classList.add('justClicked');
        setTimeout(function(){
            buttonElement.classList.remove('justClicked');
        },400);
    }

    /**
     * Attaches event listeners to all instances that need them set up.
     */
    PrismToolbarConstructor.prototype.attachEventListeners = function(){
        var _this = this;
        this.iterator(null,function(instance){
            if (instance.eventsAttached===false){
                // Line wrap button
                var lineWrapButton = instance.toolbarElem.querySelector('.jLineWrapButton');
                lineWrapButton.addEventListener('click',function(evt){
                    _this.toggleLineWrap(instance);
                    _this.animateButtonClick(lineWrapButton);
                });
                // -/+ collapse button
                var collapseButton = instance.toolbarElem.querySelector('.prismToolbarToggleCollapse');
                collapseButton.addEventListener('click',function(evt){
                    _this.toggleCollapsed(instance);
                    _this.animateButtonClick(collapseButton);
                });
                // Copy button
                var copyButton = instance.toolbarElem.querySelector('.jCopyButton');
                copyButton.addEventListener('click',function(evt){
                    _this.copyCode(instance);
                    _this.animateButtonClick(copyButton);
                });
                // Maximize button
                var maximizeButton = instance.toolbarElem.querySelector('.jMaximizeButton');
                maximizeButton.addEventListener('click',function(evt){
                    _this.toggleMaximize(instance);
                    _this.animateButtonClick(maximizeButton);
                });
                instance.eventsAttached = true;
            }
        });
    };
    /**
     * Iterates over all PrismToolbar "Instances" and passes an object representation of the instance to the callback
     * @param {string} [OPT_SubItem] - The key of a specific object property you would like to get in the callback instead of the full object
     * @param {function} callback - the function that will receive the instance
     */
    PrismToolbarConstructor.prototype.iterator = function(OPT_SubItem,callback){
        for (var x=0; x<this.domInstances.length; x++){
            if (typeof(OPT_SubItem==='string') && OPT_SubItem in this.domInstances[x]){
                callback(this.domInstances[x][OPT_SubItem]);
            }
            else {
                callback(this.domInstances[x]);
            }
        }
    };
    PrismToolbarConstructor.prototype.showMessage = function(instance,message){
        var messageContainer = instance.toolbarElem.querySelector('.jMessage');
        messageContainer.classList.remove('jHidden');
        messageContainer.innerText = message;
        setTimeout(function(){
            messageContainer.innerText = '';
            messageContainer.classList.add('jHidden');
        },1000);
    };
    return PrismToolbarConstructor;
}());