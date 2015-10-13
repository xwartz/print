/**
 * Print Part Of A Web Page
 * 
 */

const defaults = {
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

class Print {

    constructor(element, options) {
        this.element = element
        this.opt = Object.assign(defaults, options)
        this.init()
    }

    init() {
        this.iframe = this.createIframe()
        this.expose()
        this.print()
    }

    /**
     * create frame for print
     * @return
     */
    createIframe() {
        const suffix = (new Date()).getTime()
        const strFrameName = `print-${suffix}`
        
        let pIframe = document.createElement('iframe')

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
     * @return
     */
    expose() {

        let opt = this.opt,
            iframe = this.iframe

        // iframe dom
        let idoc = iframe.contentDocument || iframe.contentWindow.document,
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
        let b = document.createElement('base')
        b.href = document.location.protocol + '//' + document.location.host
        ihead.appendChild(b)

        // import page svg
        if (opt.svg) {
            let c = document.body.children
            for (let s = 0; s < c.length; s++) {
                if (c[s].nodeName === 'svg')
                    ihead.appendChild(c[s].cloneNode(true))
            }
        }

        // import page stylesheet
        if (opt.importCSS) {
            let ls = document.getElementsByTagName('link')
            for (let l = 0; l < ls.length; l++) {
                if (ls[l].rel === 'stylesheet') {
                    let ol = document.createElement('link')
                    ol.type = 'text/css'
                    ol.rel = 'stylesheet'
                    ol.href = ls[l].href
                    ol.media = ls[l].media || 'all'
                    ihead.appendChild(ol)
                }
            }
        }

        // import style tags
        if (opt.importStyle) {
            let sty = document.getElementsByTagName('style')
            for (let is = 0; is < sty.length; is++) {
                ihead.appendChild(sty[is].cloneNode(true))
            }
        }

        //add title of the page
        if (opt.pageTitle) {
            let t = document.createElement('title')
            t.innerText = opt.pageTitle
            ihead.appendChild(t)
        }

        // import additional stylesheet(s)
        if (opt.loadCSS) {
            if (Array.isArray(opt.loadCSS)) {
                a.forEach(function(href) {
                    let ll = document.createElement('link')
                    ll.type = 'text/css'
                    ll.rel = 'stylesheet'
                    ll.href = href
                    ihead.appendChild(ll)
                })
            } else {
                let ll = document.createElement('link')
                ll.type = 'text/css'
                ll.rel = 'stylesheet'
                ll.href = opt.loadCSS
                ihead.appendChild(ll)
            }
        }

        // grab selector as container
        if (opt.printContainer) {
            ibody.appendChild(this.element.cloneNode(true))
        } else {
            for (let ie = 0; ie < this.element.children.length; ie++) {
                ibody.appendChild(this.element.children[ie].cloneNode(true))
            }
        }

        // remove inline styles
        if (opt.removeInline) {
            let tags = ibody.getElementsByTagName('*')
            for (let it = 0; it < tags; it++) {
                it.setAttribute('style', '')
            }
        }
    }

    print() {
        let opt = this.opt,
            iframe = this.iframe

        // print
        setTimeout(function() {
            if(/MSIE/.test(iframe.className)){
                // check if the iframe was created with the ugly hack
                // and perform another ugly hack out of neccessity
                window.frames[iframe.name].focus()
                let script = document.createElement('script')
                script.innerHTML = 'window.print()'
                ihead.append(script)
            } else {
                // proper method
                iframe.contentWindow.focus()
                iframe.contentWindow.print()
            }

        }, opt.printDelay)
    }

}

export default Print