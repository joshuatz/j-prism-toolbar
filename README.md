# j-prism-toolbar
Quick toolbar thrown together for PrismJS. Typical "windows" style toolbar, with minimize/expand, fullscreen, and copy-to-clipboard buttons.
##

##
---
## Quick demo of what is built:
![Demo GIF](https://github.com/joshuatz/j-prism-toolbar/raw/master/demo-assets/j_prism_toolbar-Demo.gif "j-prism-toolbar demo")
---
---
## instructions
This is a work-in-progress, but you can already get it working just by creating a new instance and calling autoInit. For example, if you always wrap your code like
 ````
<pre><code></code></pre>
````
Then adding the toolbar is as simple as:
````
(new PrismToolbar('pre')).autoInit();
````
###
---
### Notes:
 -  Almost all classes are prefixed with "j" (just like the repo) to avoid conflicts with other libraries or stylesheets.
 -  Certain buttons try to use icons, but will fallback gracefully depending on what you have installed. It will try font-awesome -> materializecss -> fallback
 -  For the "copy-to-clipboard" feature, it will try to use ClipboardJS, but if it is not available within the global window scope, it will fall back to just selecting the text and letting the user either right click or use CTRL+C.
