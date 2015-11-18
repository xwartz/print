/**
 * Print Part Of A Web Page
 * 
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaults = {
    debug: false, // show the iframe for debugging
    importCSS: true, // import parent page css
    importStyle: false, // import style tags
    printContainer: true, // print outer container/$.selector
    loadCSS: "", // load an additional css file - load multiple stylesheet with an array []
    pageTitle: "", // add title to print page
    removeInline: true, // remove all inline styles
    printDelay: 333, // variable print delay
    svg: false, // import parent page svg icon
    doctypeString: '<!DOCTYPE html>' // document type
};

var Print = (function () {
    function Print(element, options) {
        _classCallCheck(this, Print);

        this.element = element;
        this.opt = Object.assign(defaults, options);
        this.init();
    }

    _createClass(Print, [{
        key: "init",
        value: function init() {
            var _this = this;

            this.iframe = this.createIframe();
            // iframe.ready() and iframe.load were inconsistent between browsers
            setTimeout(function () {
                _this.expose();
                _this.print();
            }, 333);
        }

        /**
         * create frame for print
         * @return
         */
    }, {
        key: "createIframe",
        value: function createIframe() {
            var suffix = new Date().getTime();
            var strFrameName = "print-" + suffix;

            var pIframe = document.createElement('iframe');

            pIframe.name = 'printIframe';
            pIframe.id = strFrameName;

            if (window.location.hostname !== document.domain && navigator.userAgent.match(/msie/i)) {
                // Ugly IE hacks due to IE not inheriting document.domain from parent
                // checks if document.domain is set by comparing the host name against document.domain
                var iframeSrc = "javascript:document.write(\"<head><script>document.domain=\\\"" + document.domain + "\\\";</script></head><body></body>\")";

                pIframe.className = 'MSIE';
                pIframe.src = iframeSrc;
            }

            document.body.appendChild(pIframe);

            return pIframe;
        }

        /**
         * expose options
         * @return
         */
    }, {
        key: "expose",
        value: function expose() {

            var opt = this.opt,
                iframe = this.iframe;

            // iframe dom
            var idoc = iframe.contentDocument || iframe.contentWindow.document,
                ihead = idoc.head,
                ibody = idoc.body;

            // iframe style
            iframe.style.position = 'absolute';
            iframe.style.top = '0';
            iframe.style["with"] = '100%';
            iframe.style.height = '100%';

            // Add doctype to fix the style difference between printing and render
            if (opt.doctypeString) {
                var win, doc;
                win = iframe;
                win = win.contentWindow || win.contentDocument || win;
                doc = win.document || win.contentDocument || win;
                doc.open();
                doc.write(doctype);
                doc.close();
            }

            // fix svg render
            if (iframe.contentDocument) {
                iframe.contentDocument.open();
                iframe.contentDocument.close();
            }

            // hide iframe if not in debug mode
            if (!opt.debug) {
                iframe.style.display = 'none';
            }

            // add base tag to ensure elements use the parent domain
            var b = document.createElement('base');
            b.href = document.location.protocol + '//' + document.location.host;

            ihead.appendChild(b);

            // import page svg
            if (opt.svg) {
                var c = document.body.children;
                for (var s = 0; s < c.length; s++) {
                    if (c[s].nodeName === 'svg') ihead.appendChild(c[s].cloneNode(true));
                }
            }

            // import page stylesheet
            if (opt.importCSS) {
                var ls = document.getElementsByTagName('link');
                for (var l = 0; l < ls.length; l++) {
                    if (ls[l].rel === 'stylesheet') {
                        var ol = document.createElement('link');
                        ol.type = 'text/css';
                        ol.rel = 'stylesheet';
                        ol.href = ls[l].href;
                        ol.media = ls[l].media || 'all';
                        ihead.appendChild(ol);
                    }
                }
            }

            // import style tags
            if (opt.importStyle) {
                var sty = document.getElementsByTagName('style');
                for (var is = 0; is < sty.length; is++) {
                    ihead.appendChild(sty[is].cloneNode(true));
                }
            }

            //add title of the page
            if (opt.pageTitle) {
                var t = document.createElement('title');
                t.innerText = opt.pageTitle;
                ihead.appendChild(t);
            }

            // import additional stylesheet(s)
            if (opt.loadCSS) {
                if (Array.isArray(opt.loadCSS)) {
                    a.forEach(function (href) {
                        var ll = document.createElement('link');
                        ll.type = 'text/css';
                        ll.rel = 'stylesheet';
                        ll.href = href;
                        ihead.appendChild(ll);
                    });
                } else {
                    var ll = document.createElement('link');
                    ll.type = 'text/css';
                    ll.rel = 'stylesheet';
                    ll.href = opt.loadCSS;
                    ihead.appendChild(ll);
                }
            }

            // grab selector as container
            if (opt.printContainer) {
                ibody.appendChild(this.element.cloneNode(true));
            } else {
                for (var ie = 0; ie < this.element.children.length; ie++) {
                    ibody.appendChild(this.element.children[ie].cloneNode(true));
                }
            }

            // remove inline styles
            if (opt.removeInline) {
                var tags = ibody.getElementsByTagName('*');
                for (var it = 0; it < tags; it++) {
                    it.setAttribute('style', '');
                }
            }
        }
    }, {
        key: "print",
        value: function print() {
            var opt = this.opt,
                iframe = this.iframe;

            // print
            setTimeout(function () {
                if (/MSIE/.test(iframe.className)) {
                    // check if the iframe was created with the ugly hack
                    // and perform another ugly hack out of neccessity
                    window.frames[iframe.name].focus();
                    var script = document.createElement('script');
                    script.innerHTML = 'window.print()';
                    ihead.append(script);
                } else {
                    // proper method
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                }
            }, opt.printDelay);
        }
    }]);

    return Print;
})();

exports["default"] = Print;
module.exports = exports["default"];