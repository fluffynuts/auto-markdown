# auto-markdown
Provides a single script to automatically convert markdown in html

# how?
This is really just a convenience script standing on the shoulders of a some very tall giants:
- [ShowDownJs](https://github.com/showdownjs/showdown)
- [HighlightJs](https://github.com/isagalaev/highlight.js)

`auto-markdown.js` simply ensures that `showdown` has been included in the page and, at page load, gets `showdown` to do all the hard work on any element which has the class "markdown". Thereafter, `highlight` is invoked to prettify any blocks of code.

# using

1. The easy way: add one script tag to your page with the following source:
[https://raw.githubusercontent.com/fluffynuts/auto-markdown/master](https://raw.githubusercontent.com/fluffynuts/auto-markdown/master)
2. Download `auto-markdown.js` and reference it from wherever you keep it

# how do I know you won't do something sneaky on my site?
You don't have to trust me -- just download and host a version of the script you're happy with. Though I pinky-swear not to do anything nefarious on your pages (:

# customising
By default, `auto-markdown` will use pre-defined settings:
- version 1.8.6 of `showdown`
- version 9.12.0 of `highlight`
- the `vs2015` `highlight` theme

You can change this in two ways:
1. Include your own script tags for `highlight` and/or `showdown` _before_ `auto-markdown` (and ensure that they aren't `async`). If you include a script tag for `highlight`, you must include a syntax highlighting theme.
2. You can set any of the following variables at `window` scope:
  - showdownVersion
  - highlightVersion
  - highlightTheme

# why?
Because I write blog posts on blogger.com and the editor there is a super pain to do code blog posts with. I'd already worked with `highlight` and this just makes it even simpler:
1. Switch to the raw html editor
2. create &lt;pre class="markdown"&gt;&lt;/pre&gt;
3. write markdown in there
4. profit!

# my markdown isn't rendering )':
Make sure you have the markdown aligned to the very left of the page. If you have leading whitespace, markdown syntax won't be recognised. If it still doesn't render, open an issue.