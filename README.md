# j-prism-toolbar
Quick toolbar thrown together for PrismJS. Typical "windows" style toolbar, with minimize/expand, fullscreen, and copy-to-clipboard buttons.
##
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