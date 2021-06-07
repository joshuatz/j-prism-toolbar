export interface InstanceConfig {
    wrapCombo: boolean;
    iconStyle: 'emoji' | 'plaintext' | 'material' | 'fontawesome';
    autoFix: boolean;
    animate: boolean;
    lineWrap: boolean;
    remoteSrc: boolean | string;
}

export interface GlobalConfig extends InstanceConfig {
    selector?: string;
    targetElements?: NodeListOf<HTMLElement> | HTMLElement;
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