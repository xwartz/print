// Note: under Node env , iframe should loaded

var assert = require('assert');
var jsdom = require('jsdom');

import Print from '../src/print';

describe('Print', () => {
    before(() => {

        jsdom.env({
            html: "<html><head></head><body><div id='print'></div></body></html>",
            done: function(err, window) {
                global.window = window
                global.document = window.document
                global.element = window.document.getElementById('print')
            }
        });

        global.options = {
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
    })

    // after(() => {
    //     document.body.innerHTML = '';
    // });


    describe('#createIframe()', () => {
        it('should create an iframe', () => {
            let print = new Print(element, options)
            assert.equal(global.document.getElementById(print.iframe.id), print.iframe)
        })
    })
})