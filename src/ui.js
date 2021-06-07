import { IconMap, ToolbarCSS } from './constants';

/**
 * @typedef {import('./types').InstanceConfig} Config
 * @typedef {keyof typeof IconMap} ButtonType
 */

export class JPrismToolbarUI {
    /**
     * @param {Config} config
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * If neither Material or FontAwesome is to be used,
     * fallback to a plain button type
     * @param {ButtonType} buttonType
     * @param {Config} [config]
     */
    getFallbackButtonCode(buttonType, config) {
        config = config || this.config;
        const emoji = IconMap[buttonType].emoji;
        const str = emoji && config.iconStyle === 'emoji' ? emoji : buttonType;
        return `<div class="jAutCtPrnt jIconWrapper jIconSldBg">
                <div class="jFallback">${str}</div>
            </div>`;
    }

    /**
     * @param {ButtonType} buttonType
     * @param {Config} [config]
     */
    getButtonCode(buttonType, config) {
        config = config || this.config;
        if (config.iconStyle === 'material') {
            return this.getThirdPartyIconCode(buttonType, true);
        } else if (config.iconStyle === 'fontawesome') {
            return this.getThirdPartyIconCode(buttonType, false);
        } else {
            return this.getFallbackButtonCode(buttonType, config);
        }
    }

    /**
     * @param {ButtonType} buttonType
     * @param {boolean} isMaterial
     */
    getThirdPartyIconCode(buttonType, isMaterial) {
        const identifier = isMaterial ? IconMap[buttonType].material : IconMap[buttonType].fa;
        return `<div class="jAutCtPrnt jIconWrapper jIconSldBg">
                <i class="${isMaterial ? 'material-icons left' + identifier : 'fa ' + identifier + ' jIconSldBg'}" ${
            isMaterial ? '' : 'aria-hidden="true"'
        }>
                </i>
            </div>`;
    }

    /**
     * Main function to get entire injectable toolbar HTML
     * @param {Config} [config]
     */
    getToolbarHtml(config) {
        const lineWrapButtonCode = `<div class="jPTbrTogLWrap JtbBtn JtbBtnShowPointer jLineWrapButton jHsFlbkIcons jShadowLight" title="Toggle Line Wrap" data-linewrapon="false">${this.getButtonCode(
            'break',
            config
        )}</div>`;
        const copyButtonCode = `<div class="JtbBtn jCopyButton jHsFlbkIcons jShadowLight" title="Copy code to clipboard">${this.getButtonCode(
            'copy',
            config
        )}</div>`;
        const maximizeButtonCode = `<div class="JtbBtn JtbBtnShowPointer jMaximizeButton jHsFlbkIcons jShadowLight" title="Fullscreen code view">${this.getButtonCode(
            'max',
            config
        )}</div>`;

        return `
        <div class="jToolbar jShadow">
            <div class="jContent">
                <div class="jLeftSide">
                    <div class="jMessageWrapper">
                        <div class="jMessage jHidden"></div>
                        <div class="jRemoteSrcDisplay jHidden"></div>
                    </div>
                </div>
                <div class="jRightSide">
                    ${lineWrapButtonCode}
                    ${copyButtonCode}
                    <div class="prismTbTgCollap JtbBtn JtbBtnShowPointer jShadowLight" data-collapsed="false" title="Toggle collapse of code embed">
                        <div class="isNotCollapsed jAutCtPrnt jIconWrapper"><div style="margin-top:-4px">-</div></div>
                        <div class="isCollapsed jAutCtPrnt jIconWrapper"><div>+</div></div>
                    </div>
                    ${maximizeButtonCode}
                </div>
            </div>
        </div>`;
    }

    getToolbarCss() {
        return ToolbarCSS;
    }
}
