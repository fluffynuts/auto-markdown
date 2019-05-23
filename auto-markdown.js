(function () {
    var showdownVersion = window.showDownVersion || "1.8.6",
        highlightVersion = window.highlightVersion || "9.12.0",
        highlightTheme = window.highlightTheme || "vs2015",
        autoMarkdownClass = "markdown",
        alreadyRenderedClass = "rendered-markdown",
        autoMarkdownSelector = "." + autoMarkdownClass;

    function includeShowdownJs() {
        includeScript(
            "//cdnjs.cloudflare.com/ajax/libs/showdown/" +
            showdownVersion +
            "/showdown.min.js"
        );
    }

    function includeHighlightJs() {
        includeStyle(
            "//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/" +
            highlightTheme +
            ".min.css"
        );
        includeScript(
            "//cdnjs.cloudflare.com/ajax/libs/highlight.js/" +
            highlightVersion +
            "/highlight.min.js"
        );
    }

    function includeFetchPolyfill() {
        includeScript("//cdnjs.cloudflare.com/ajax/libs/fetch/2.0.4/fetch.js");
    }

    function includePromisePolyfill() {
        includeScript(
            "//cdnjs.cloudflare.com/ajax/libs/es6-promise/4.1.1/es6-promise.auto.js"
        );
    }

    function includeStyle(url) {
        var target = findScriptsContainer(),
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
        var target = findScriptsContainer(),
            el = document.createElement("script"),
            protocol = determineProtocol();
        el.src = protocol + url;
        target.appendChild(el);
    }

    function haveRequirements() {
        return window.showdown && window.hljs && window.fetch && window.Promise;
    }

    function renderMarkdown() {
        if (!haveRequirements()) {
            return window.setTimeout(function () {
                renderMarkdown();
            }, 50);
        }
        console.log("attempting to render markdown elements");
        Array.from(document.querySelectorAll(autoMarkdownSelector)).forEach(
            function (el) {
                if (el.classList.contains(alreadyRenderedClass)) {
                    return;
                }
                renderMarkdownIn(el);
            }
        );
    }

    function workaroundCode(text) {
        var parts = text.split("`");
        var idx = 0;
        for (var part in parts) {
            if (idx % 2 === 0) {
                continue;
            }
            parts[idx] = parts[idx]
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
        }
        return parts.join("`");
    }

    function fetchTextFor(el) {
        var url = getSrc(el);
        if (url) {
            console.log("fetching src: ", url);
            return fetch(url).then(function (response) {
                console.log("fetching text for src: ", url);
                return response.text();
            });
        } else {
            return Promise.resolve(el.innerText);
        }
    }

    function getSrc(el) {
        var attr = el.attributes["data-src"];
        return attr ? attr.value : undefined;
    }

    function renderMarkdownIn(el) {
        fetchTextFor(el).then(function (raw) {
            var text = workaroundCode(raw),
                target = document.createElement("p"),
                converter = new showdown.Converter(),
                html = converter.makeHtml(text);
            console.log("marking down");
            target.innerHTML = html;
            el.classList.add(alreadyRenderedClass);
            target.classList.add(alreadyRenderedClass);
            el.parentNode.insertBefore(target, el);
            el.style.display = "none";
            Array.from(target.querySelectorAll("code")).forEach(function (codeEl) {
                if (codeEl.innerText.indexOf("\n") === -1) {
                    return; // highlighting a small <code>...</code> tagset leads to readability issues
                }
                hljs.highlightBlock(codeEl);
            });
            fixRelativeImgPaths(el, target);
            hidePostTitleIfHaveH1In(target);
            redirectMdLinksToHtmlIn(target);
        });
    }

    function redirectMdLinksToHtmlIn(el) {
        if (window.location.host.indexOf("blogspot") === -1) {
            // the "fixes" below are very blogspot-specific
            return;
        }
        Array.from(el.querySelectorAll("a")).forEach(anchor => {
            var
                parts = anchor.href.split("/"),
                last = parts.length - 1,
                lastPart = parts[last],
                yearPart = lastPart.substr(0, 4),
                year = parseInt(yearPart, 10),
                monthPart = lastPart.substr(4, 2),
                month = parseInt(monthPart, 10),
                doc = lastPart.replace(/\.md$/, ".html");
            if (isNaN(year) || isNaN(month)) {
                return;
            }
            anchor.href = [
                window.location.protocol,
                "/",
                window.location.host,
                year,
                month,
                doc.replace(/_/, "")
            ].join("/");
        });
    }

    function hidePostTitleIfHaveH1In(target) {
        if (target.querySelector("h1")) {
            var postTitle = document.querySelector("h3.post-title");
            if (postTitle) {
                postTitle.style.display = "none";
            }
        }
    }

    function fixRelativeImgPaths(el, target) {

        var remoteUrl = getSrc(el);
        if (remoteUrl) {
            var
                parts = remoteUrl.split("/"),
                baseParts = parts.slice(0, parts.length - 1),
                baseUrl = baseParts.join("/");

            Array.from(target.querySelectorAll("img")).forEach(function (img) {
                var attr = img.attributes["src"],
                    src = attr ? attr.value : "";
                if (src && src.indexOf("://") > -1) {
                    return;
                }
                // TODO: this is naive, but may be good enough
                img.src = [baseUrl, src].join("/");
            });
        }
    }

    document.addEventListener(
        "DOMContentLoaded",
        function () {
            renderMarkdown();
        },
        false
    );
    if (!window.showdown) {
        includeShowdownJs();
    }
    if (!window.hljs) {
        includeHighlightJs();
    }
    if (!window.fetch) {
        includeFetchPolyfill();
    }
    if (!window.Promise) {
        includePromisePolyfill();
    }
})();
