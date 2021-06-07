import { JPrismToolbar } from "./src/jPrismToolbar";
import type { ClipboardJS as ClipboardJSClass } from "./src/types";

declare global {
    const ClipboardJS: typeof ClipboardJSClass;

    interface Prism {
        highlightElement(elem: HTMLElement | Element): void;
    }

    interface Window {
        PrismToolbar: typeof JPrismToolbar
        ClipboardJS?: typeof ClipboardJSClass;
        Prism: Prism;
    }
}