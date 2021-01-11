# j-prism-toolbar ![NodeJS Test Status](https://github.com/joshuatz/j-prism-toolbar/workflows/Node.js%20CI/badge.svg) [![NPM Badge](https://img.shields.io/npm/v/j-prism-toolbar)](https://www.npmjs.com/package/j-prism-toolbar)
Quick toolbar thrown together for PrismJS. Typical "windows" style toolbar, with minimize/expand, fullscreen, and copy-to-clipboard buttons.

See it in action all over [joshuatz.com](https://joshuatz.com/) 😄 ([example page](https://joshuatz.com/posts/2019/coding-a-css-theme-switcher-a-multitude-of-web-dev-options/))


---

## Demo
![Demo GIF](https://github.com/joshuatz/j-prism-toolbar/raw/main/demo-assets/j_prism_toolbar-Demo.gif "j-prism-toolbar demo")

---

## Instructions
There is only one file that needs to be added to your webpage (or bundled): `dist/jPrismToolbar.min.js`. You can also fetch it from a CDN, for example:

```html
<script src="https://cdn.jsdelivr.net/npm/j-prism-toolbar"></script>
```

To actually instantiate and render all the toolbars, it is usually as easy as creating a new instance and calling autoInit. For example, if you always wrap your code like

```html
<pre><code></code></pre>
````

Then adding the toolbar is as simple as:

```js
(new PrismToolbar()).autoInit();
```

> Make sure you run the initializer *after* the DOM is ready; either put your code in the footer, or attach to the `DOMContentLoaded` event.

> The default CSS selector used by `.autoInit()` looks like `pre > code[class*="language-"]`, whereas `.autoInitAll()` is `pre > code[class*="language-"], pre[class] > code`

> You can also pass a custom CSS selector to `.autoInit()`

---

### Sample
Here is a full sample:

```html
<body>
    <!-- Here is an embed -->
    <pre>
        <code class="language-js">console.log('Hello World!');</code>
    </pre>

    <!-- Sample of how to load and init the toolbar -->
    <script src="https://cdn.jsdelivr.net/npm/j-prism-toolbar"></script>
    <script>
        (new PrismToolbar()).autoInit();
    </script>
</body>
```

---

### Advanced Usage
Certain settings can be controlled on a 'per instance' basis and can be either passed into the constructor or added as attributes on the code element. Some settings are global.

#### Global Settings
> Default values are shown. All settings are optional, and you can pass a single CSS selector string to constructor instead of options.selector, if you prefer.

```js
const instance = new PrismToolbar({
    // Used for .autoInit()
    // CSS selector used to find code elements to inject toolbar into.
    selector: 'pre > code[class*="language-"]',
    // Alternative to above setting (and overrides it)
    targetElements: [] // NodeList
    // boolean, whether or not the toolbar + code embed should be wrapped *together* in wrapper, or just have toolbar and code elem be sibling
    wrapCombo: true // unless using autoInit(), then false
    // The style of icon to use for the toolbar. Can pick from `emoji`, `plaintext`,  `material`, or `fontawesome`.
    // For choices other than `emoji` or `plaintext`, you must have the font pack installed.
    iconStyle: 'emoji',
    // Use if you have code blocks that are not getting picked up by the Prism highlighter, because they don't adhere to the standard.
    // For example, `autoFix` can turn Pandoc output of `<pre class="js"><code></code></pre>` into the correct standard of `<pre><code class="language-js"></code></pre>`, and then re-highlight it with Prism.
    autoFix: false,
    /**
     * The following settings can also be overridden on a per-instance basis, through HTML attributes
     * See below section for details
     */
    // Use CSS animations
    animate: true,
    // Use linewrap
    lineWrap: false,
    // If set to a URL string that returns text, it will be loaded into the embed
    remoteSrc: false
});
```
#### Per-Embed Settings

These settings can be changed per-embed (aka *per-instance*), and controlled via HTML attributes. If set, they will override the global settings (see above section).

Settings key | HTML attribute key | default | description
--- | --- | --- | ----
`animate` | `data-animate` | `true` | boolean, whether CSS animations should be used (for example, when collapsing or opening an embed)
`lineWrap` | `data-linewrap` | `false` | boolean, whether or not the preview should use linewrap
`remoteSrc` | `data-jptremote` | `false` | Set to a URL string that returns code as text (such as what you get when you click "view raw" on Github) and it will get pulled into the code preview box via AJAX and my tool will trigger Prism to re-highlight it

### Notes:

 -  Almost all classes are prefixed with "j" (just like the repo) to avoid conflicts with other libraries or stylesheets.
 -  Certain buttons try to use icons, but will fallback gracefully depending on what you have installed. It will try font-awesome -> materializecss -> fallback
 -  For the "copy-to-clipboard" feature, it will try to use ClipboardJS, but if it is not available within the global window scope, it will fall back to:
     1. Trying the browser API (`navigator.clipboard`)
     2. Selecting the text and prompting user to copy themselves
