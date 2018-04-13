(function() {
  var
    showdownVersion = window.showDownVersion || "1.8.6",
    highlightVersion = window.highlightVersion || "9.12.0",
    highlightTheme = window.highlightTheme || "vs2015",
    autoMarkdownClass = "markdown",
    alreadyRenderedClass = "rendered-markdown",
    autoMarkdownSelector = "." + autoMarkdownClass;
  function includeShowdownJs() {
    includeScript("//cdnjs.cloudflare.com/ajax/libs/showdown/" + showdownVersion + "/showdown.min.js");
  }
  function includeHighlightJs() {
    includeStyle("//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/" + highlightTheme + ".min.css");
    includeScript("//cdnjs.cloudflare.com/ajax/libs/highlight.js/" + highlightVersion + "/highlight.min.js");
  }

  function includeStyle(url) {
    var
      target = findScriptsContainer(),
      el = document.createElement("link"),
      protocol = determineProtocol();
    el.href = protocol + url;
    el.rel = "stylesheet";
    target.appendChild(el);
  }
  function determineProtocol() {
      return window.location.protocol === "file:"
        ? "https:"
        : window.location.protocol;
  }
  function findScriptsContainer() {
      return document.querySelector("head") || document.querySelector("body");
  }
  function includeScript(url) {
    var
      target = findScriptsContainer(),
      el = document.createElement("script"),
      protocol = determineProtocol();
    el.src = protocol + url;
    target.appendChild(el);
  }

  function renderMarkdown() {
    if (!window.showdown) {
      return window.setTimeout(function() {
        renderMarkdown();
      }, 50);
    }
    console.log("attempting to render markdown elements");
    Array.from(document.querySelectorAll(autoMarkdownSelector)).forEach(function(el) {
        if (el.classList.contains(alreadyRenderedClass)) {
          return;
        }
        renderMarkdownIn(el);
    });
    highlightCode();
  }

  function highlightCode() {
    if (!window.hljs) {
      return window.setTimeout(function() {
        highlightCode();
      }, 50);
    }
    Array.from(document.querySelectorAll("pre code")).forEach(function(el) {
      hljs.highlightBlock(el);
    });
  }

  function renderMarkdownIn(el) {
    var text = el.innerText,
        target = document.createElement("p"),
        converter = new showdown.Converter(),
        html = converter.makeHtml(text);
    console.log("marking down");
    target.innerHTML = html;
    el.classList.add(alreadyRenderedClass);
    target.classList.add(alreadyRenderedClass);
    el.parentNode.insertBefore(target, el);
    el.style.display = "none";
  }

  document.addEventListener("DOMContentLoaded", function() {
    renderMarkdown();
  }, false);
  if (!window.showdown) {
    includeShowdownJs();
  }
  if (!window.hljs){
    includeHighlightJs();
  }
})();