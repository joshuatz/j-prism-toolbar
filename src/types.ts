import { PrismToolbar } from "./toolbar";

export interface InstanceConfig {
    /**
     * Whether or not the toolbar + code embed should be wrapped *together* in wrapper, or just have toolbar and code elem be sibling
     * @default true
     */
    wrapCombo: boolean;
    /**
     * The style of icon to use for the toolbar.
     * For choices other than `emoji` or `plaintext`, you must have the font pack installed.
     * @default 'emoji'
     */
    iconStyle: 'emoji' | 'plaintext' | 'material' | 'fontawesome';
    /**
     * Use if you have code blocks that are not getting picked up by the Prism highlighter, because they don't adhere to the standard.
     * - For example, `autoFix` can turn Pandoc output of `<pre class="js"><code></code></pre>` into the correct standard of `<pre><code class="language-js"></code></pre>`, and then re-highlight it with Prism.
     * @default false
     */
    autoFix: boolean;
    // The following settings can also be overridden on a per-instance basis, through HTML attributes
    /**
     * Use CSS animations
     * @default true
     */
    animate: boolean;
    /**
     * Use linewrap - e.g. white-space: pre-wrap
     */
    lineWrap: boolean;
    /**
     * If set to a URL string that returns text, it will be loaded into the embed
     * @default false
     */
    remoteSrc: boolean | string;
}

export interface GlobalConfig extends InstanceConfig {
    /**
     * CSS selector used to find code elements to inject toolbar into.
     *  - Used for .autoInit()
     * @default 'pre > code[class*="language-"]'
     */
    selector?: string;
    /**
     * Alternative to `selector` (and overrides it)
     */
    targetElements?: NodeListOf<HTMLElement> | HTMLElement;
    /**
     * Extra logging
     * @default false
     */
    debug: boolean;
}

export interface ToolbarInstance {
    container: HTMLElement;
    codeElem: HTMLPreElement | HTMLElement;
    toolbarElem: HTMLDivElement;
    collapsed: boolean;
    copyButton: HTMLElement | HTMLDivElement | HTMLButtonElement;
    clipboardInitialized: boolean;
    ClipboardJSInstance?: ClipboardJS;
    eventsAttached: boolean;
    config: InstanceConfig;
    isMaximized: boolean;
    fullscreenWrapper?: HTMLDivElement
    /**
     * Internal use - unique ID
     */
    id: string;
}

/**
 * For HTML attributes that can override per instance configs
 */
export interface OverrideMap {
    /**
     * The literal string used as the attribute key
     */
    attr: string;
    /**
     * The type of value to be parsed from the attribute value
     */
    type: 'boolean' | 'string' | 'number' | 'object';
    /**
     * The per-instance config setting to override, specified by key
     */
    setting: keyof InstanceConfig;
}

export interface GhGistFile {
    content: string;
    filename: string;
    language: string;
    raw_url: string;
    trunctated: boolean;
}

export declare class ClipboardJS {
    constructor(input: string | HTMLElement | NodeListOf<HTMLElement>, config?: {
        container?: HTMLElement;
    });
    public on(
        eventType: 'success' | 'error',
        callback: (event: Event) => void
    ): void;
    public destroy(): void;
}

declare global {
    interface Window {
        PrismToolbar: typeof PrismToolbar
    }
}