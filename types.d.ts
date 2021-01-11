interface InstanceConfig {
    wrapCombo: boolean;
    iconStyle: 'emoji' | 'plaintext' | 'material' | 'fontawesome';
    autoFix: boolean;
    animate: boolean;
    lineWrap: boolean;
    remoteSrc: boolean | string;
}

interface GlobalConfig extends InstanceConfig {
    debug: boolean;
}

interface ToolbarInstance {
    container: HTMLElement;
    codeElem: HTMLPreElement | HTMLElement;
    toolbarElem: HTMLDivElement;
    collapsed: boolean;
    copyButton: Element | HTMLDivElement | HTMLButtonElement;
    clipboardInitialized: boolean;
    eventsAttached: boolean;
    config: InstanceConfig;
    isMaximized: boolean;
    fullscreenWrapper?: HTMLDivElement
}