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
        var copyButtonCode = '' +
        '<div class="jToolbarButton jCopyButton jHasFallbackIcons jShadowLight">' +
            // Fallback
            '<div class="jAutoCenterParent jIconWrapper jIconsSolidBackground">' +
                '<div class="jFallback">Copy</div>' +
            '</div>' +
            // Third Party Icons
            '<div class="jAutoCenterParent jIconWrapper jIconsSolidBackground">' +
                '<i class="material-icons left">content_copy</i>' +
            '</div>' +
            '<div class="jAutoCenterParent jIconWrapper jIconsSolidBackground">' +
                '<i class="fa fa-clone jIconsSolidBackground" aria-hidden="true"></i>' +
            '</div>' +
        '</div>';
        var maximizeButtonCode = '' +
        '<div class="jToolbarButton jMaximizeButton jHasFallbackIcons jShadowLight">' +
            // Fallback
            '<div class="jAutoCenterParent jIconWrapper jIconsSolidBackground">' +
                '<div class="jFallback">Max</div>' +
            '</div>' +
            // Third Party Icons
            '<div class="jAutoCenterParent jIconWrapper jIconsSolidBackground">' +
                '<i class="material-icons left">fullscreen</i>' +
            '</div>' +
            '<div class="jAutoCenterParent jIconWrapper jIconsSolidBackground">' +
                '<i class="fa fa-search-plus jIconsSolidBackground" aria-hidden="true"></i>' +
            '</div>' +
        '</div>';
        return (
            '<div class="jToolbar jShadow">' +
                '<div class="jContent">' +
                    '<div class="leftSide">' +
                        '<div class="jMessageWrapper">' +
                            '<div class="jMessage jHidden"></div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="jRightSide">' +
                        copyButtonCode +
                        '<div class="prismToolbarToggleCollapse jToolbarButton jShadowLight" data-collapsed="false">' +
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
            '.jRightSide {' +
                'position: absolute;' +
                'right: 10px;' +
                'top: 10px;' +
                'min-width: 120px;' +
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
            '.jAutoCenterParent {' +
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
            '.jCopyButton .jFallback {' +
                'font-size: 1rem;' +
            '}' +
            '.jIconsSolidBackground {' +
                'background-color: white;' +
                'color: black !important;' +
            '}' +
            '.jHasFallbackIcons > i, .jHasFallbackIcons > .jFallback, .jIconWrapper {' +
                'position: absolute;' +
                'width: 36px;' +
                'height: 36px;' +
                'text-align: center;' +
                'font-size: large;' +
                'top: 0px;' +
                'left: 0px;' +
                
            '}' +
            '.prismToolbarToggleCollapse {' +
                'display: inline-block;' +
                'cursor: pointer;' +
            '}' +
            '.jCopyButton {' +
                'cursor: copy;' +
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
            '.jCodeWrapper {' +
                'height: 94%;' +
            '}' +
            '.jFullscreenToolbar {' +
                'width: 100%;' +
                'min-height: 6%;' +
                'background-color: black;' +
            '}' +
            '.jFullscreenToolbarButton {' +
                'color: white;' +
                'font-size: 3rem;' +
                'cursor: pointer;' +
            '}' +
            '.jFullscreenWrapper .jCodeWrapper > * {' +
                'border: 2px solid white;' +
                'width: 96%;' +
                'height : 93%;' +
                'overflow-y: scroll;' +
                'margin: 0px;' +
            '}' +
            '.prismToolbarToggleCollapse > .jAutoCenterParent {' +
                'width: 100%;' +
                'height: 100%;' +
            '}' +
            '.leftSide {' +
                'max-width: 50%;' +
            '}' +
            '.jMessageWrapper {' +
                'width: auto;' +
            '}' +
            '.jMessage {' +
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
            '}'
        );
    }

    /**
    * Constructor and Public Functions
    */
    function PrismToolbarConstructor(settings){
        settings = (settings || {});
        this.injectedStyles = false;
        this.animate = typeof(settings.animate)==='boolean' ? settings.animate : true;
        this.selector = typeof(settings.selector)==='string' ? settings.selector : '';
        this.useParent = typeof(settings.useParent)==='boolean' ? settings.useParent : false;
        this.domInstances = [];
    }
    PrismToolbarConstructor.prototype.init = function(){
        if (!this.injectedStyles){
            var styleBlock = document.createElement('style');styleBlock.innerText = getToolbarCss();
            document.getElementsByTagName('body')[0].appendChild(styleBlock);
            this.injectedStyles = true;
        }
        if (this.selector && this.selector !== ''){
            var counter = 0;
            document.querySelectorAll(this.selector).forEach(function(elem){
                counter++;
                if (this.useParent){
                    elem = elem.parentNode;
                }
                // Now, in this context, elem is the code element (pre usually)
                var toolbarElem = document.createElement('div');
                toolbarElem.className = 'jToolbarWrapper';
                toolbarElem.innerHTML = getToolbarHtml();

                // Check to see if <pre></pre> is already wrapped with toolbar wrapper - if not, wrap it
                if (!elem.parentNode.classList.contains('code-toolbar')){
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
                elem.style.webkitTransition = 'all 1s';
                elem.style.transition = 'all 1s';

                // Generate ID for code element and set as target of copy button
                var codeElemId = elem.getAttribute('id');
                var copyButton = toolbarElem.querySelector('.jCopyButton');
                if (!codeElemId || codeElemId===''){
                    codeElemId = 'jCodeElem_' + counter;
                    elem.setAttribute('id',codeElemId);
                }
                copyButton.setAttribute('data-clipboard-target','#' + codeElemId);

                // Save
                this.domInstances.push({
                    container : elem.parentNode,
                    codeElem : elem,
                    toolbarElem : toolbarElem,
                    collapsed : false,
                    copyButton : copyButton
                });
            }.bind(this));

            // Attach event listeners
            this.attachEventListeners();

            // Init ClipboardJS
            if (this.getHasClipboardJS()===true){
                this.iterator('copyButton',function(copyButton){
                    this.ClipboardJSInstance = new ClipboardJS(copyButton);
                }.bind(this));
            }
        }
        else {
            console.warn('init was called, but no selector given');
        }
        return this;
    }
    PrismToolbarConstructor.prototype.autoInit = function(){
        this.selector = 'pre > code[class*="language-"]';
        this.useParent = true;
        this.init();
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
            fullscreenWrapper.className = 'jFullscreenWrapper';
            // Create toolbar
            fullscreenWrapper.innerHTML = '' +
                '<div class="jFullscreenToolbar">' +
                    '<div style="float:right; margin-right:14px;">' +
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
    PrismToolbarConstructor.prototype.attachEventListeners = function(){
        var _this = this;
        this.iterator(null,function(instance){
            // -/+ collapse button
            instance.container.querySelector('.prismToolbarToggleCollapse').addEventListener('click',function(evt){
                _this.toggleCollapsed(instance);
            });
            // Copy button
            instance.container.querySelector('.jCopyButton').addEventListener('click',function(evt){
                _this.copyCode(instance);
            });
            // Maximize button
            instance.container.querySelector('.jMaximizeButton').addEventListener('click',function(evt){
                _this.toggleMaximize(instance);
            });
        });
    };
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