/* 
 * print.js 0.0.1
 * ECMAScript 5+
 *
 * Resources (based on) : printThis: https://github.com/jasonday/printThis
 *
 * todo
 *   - formValues //preserve input/form values
 *   -
 *
 * Usage:
 *  var b = document.getElementById('selector')
 *  new Print(b, {
 *      debug: false,               * show the iframe for debugging
 *      importCSS: true,            * import page CSS
 *      importStyle: false,         * import style tags
 *      printContainer: true,       * grab outer container as well as the contents of the selector
 *      loadCSS: "path/to/my.css",  * path to additional css file - us an array [] for multiple
 *      pageTitle: "",              * add title to print page
 *      removeInline: false,        * remove all inline styles from print elements
 *      printDelay: 333,            * variable print delay
 *      header: null,               * prefix to html
 *      formValues: true            * preserve input/form values
 *  })
 *
 * Notes:
 *  - the loadCSS will load additional css (with or without @media print) into the iframe, adjusting layout
 */

(function() {

    var root = typeof self === 'object' && self.self === self && self ||
        typeof global === 'object' && global.global === global && global || this

    var Print = function(element, options) {
        this.opt = Helper.extend({}, defaults, options)
        this.element = element;
        this.init()
    }

    var previousPrint = root.Print

    var slice = [].slice

    // module
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Print
        }
        exports.Print = Print
    } else {
        root.Print = Print
    }

    Print.VERSION = '0.0.1'

    Print.noConflict = function() {
        root.Print = previousPrint
        return this
    };


    // helper function
    var Helper = {
        extend: function(obj) {
            var source, prop;
            for (var i = 1, length = arguments.length; i < length; i++) {
                source = arguments[i]
                for (prop in source) {
                    obj[prop] = source[prop]
                }
            }
            return obj
        },

        isArray: function(obj) {
            return Array.isArray(obj) || toString.call(obj) === '[object Array]'
        }
    }

    var defaults = {
        debug: false, // show the iframe for debugging
        importCSS: true, // import parent page css
        importStyle: false, // import style tags
        printContainer: true, // print outer container/$.selector
        loadCSS: "", // load an additional css file - load multiple stylesheet with an array []
        pageTitle: "", // add title to print page
        removeInline: true, // remove all inline styles
        printDelay: 333, // variable print delay
        svg: false // import parent page svg icon
    }

    var fn = Print.prototype

    fn.init = function() {
        this.iframe = this.createIframe()
        this.expose()
        this.print()
    }

    /**
     * create frame for print
     */
    fn.createIframe = function() {
        var strFrameName = 'print-' + (new Date()).getTime()
        var pIframe = document.createElement('iframe')
        pIframe.name = 'printIframe'
        pIframe.id = strFrameName

        if (window.location.hostname !== document.domain && navigator.userAgent.match(/msie/i)) {
            // Ugly IE hacks due to IE not inheriting document.domain from parent
            // checks if document.domain is set by comparing the host name against document.domain
            var iframeSrc = "javascript:document.write(\"<head><script>document.domain=\\\"" + document.domain + "\\\";</script></head><body></body>\")"

            pIframe.className = 'MSIE'
            pIframe.src = iframeSrc
        }

        document.body.appendChild(pIframe)

        return pIframe
    }

    /**
     * expose options
     */
    fn.expose = function() {
        var opt = this.opt,
            iframe = this.iframe


        // iframe dom
        var idoc = iframe.contentDocument || iframe.contentWindow.document,
            ihead = idoc.head,
            ibody = idoc.body

        // iframe style
        iframe.style.position = 'absolute'
        iframe.style.top = '0'
        iframe.style.with = '100%'
        iframe.style.height = '100%'

        // hide iframe if not in debug mode
        if (!opt.debug) {
            iframe.style.display = 'none'
        }

        // add base tag to ensure elements use the parent domain
        var b = document.createElement('base')
        b.href = document.location.protocol + '//' + document.location.host
        ihead.appendChild(b)

        // import page svg
        if (opt.svg) {
            var c = document.body.children
            for (var s = 0; s < c.length; s++) {
                if (c[s].nodeName === 'svg')
                    ihead.appendChild(c[s].cloneNode(true))
            }
        }

        // import page stylesheet
        if (opt.importCSS) {
            var ls = document.getElementsByTagName('link')
            for (var l = 0; l < ls.length; l++) {
                if (ls[l].rel === 'stylesheet') {
                    var ol = document.createElement('link')
                    ol.type = 'text/css'
                    ol.rel = 'stylesheet'
                    ol.href = ls[l].href;
                    ol.media = ls[l].media || 'all'
                    ihead.appendChild(ol)
                }
            }
        }

        // import style tags
        if (opt.importStyle) {
            var sty = document.getElementsByTagName('style')
            for (var is = 0; is < sty.length; is++) {
                ihead.appendChild(sty[is].cloneNode(true))
            }
        }

        //add title of the page
        if (opt.pageTitle) {
            var t = document.createElement('title')
            t.innerText = opt.pageTitle
            ihead.appendChild(t)
        }

        // import additional stylesheet(s)
        if (opt.loadCSS) {
            if (Helper.isArray(opt.loadCSS)) {
                a.forEach(function(href) {
                    var ll = document.createElement('link')
                    ll.type = 'text/css'
                    ll.rel = 'stylesheet'
                    ll.href = href;
                    ihead.appendChild(ll)
                })
            } else {
                var ll = document.createElement('link')
                ll.type = 'text/css'
                ll.rel = 'stylesheet'
                ll.href = opt.loadCSS;
                ihead.appendChild(ll)
            }
        }

        // grab selector as container
        if (opt.printContainer) {
            ibody.appendChild(this.element.cloneNode(true))
        } else {
            for (var ie = 0; ie < this.element.children.length; ie++) {
                ibody.appendChild(this.element.children[ie].cloneNode(true))
            }
        }

        // remove inline styles
        if (opt.removeInline) {
            var tags = ibody.getElementsByTagName('*')
            for (var it = 0; it < tags; it++) {
                it.setAttribute('style', '')
            }
        }
    }

    fn.print = function () {
        var opt = this.opt,
            iframe = this.iframe

        // print
        setTimeout(function() {
            if(/MSIE/.test(iframe.className)){
                // check if the iframe was created with the ugly hack
                // and perform another ugly hack out of neccessity
                window.frames[iframe.name].focus();
                var script = document.createElement('script')
                script.innerHTML = 'window.print()'
                ihead.append(script)
            } else {
                // proper method
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
            }

        }, opt.printDelay);
    }

}())