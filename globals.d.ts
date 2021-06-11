import { PrismToolbar } from "./src/toolbar";
import type { ClipboardJS as ClipboardJSClass } from "./src/types";

declare global {
    const ClipboardJS: typeof ClipboardJSClass;

    interface Prism {
        highlightElement(elem: HTMLElement | Element): void;
    }

    interface Window {
        PrismToolbar: typeof PrismToolbar
        ClipboardJS?: typeof ClipboardJSClass;
        Prism: Prism;
    }
}