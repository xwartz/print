# print
Print Part Of A Web Page
Resources (based on) : printThis: https://github.com/jasonday/printThis

## Usage:
```js
  var b = document.getElementById('selector')
  new Print(b, {
      debug: false, // show the iframe for debugging
      importCSS: true, // import parent page css
      importStyle: false, // import style tags
      printContainer: true, // print outer container/$.selector
      loadCSS: "", // load an additional css file - load multiple stylesheet with an array []
      pageTitle: "", // add title to print page
      removeInline: true, // remove all inline styles
      printDelay: 333, // variable print delay
      svg: false // import parent page svg icon
  })
```

## Notes:
  - the loadCSS will load additional css (with or without @media print) into the iframe, adjusting layout

## todo
   - formValues //preserve input/form values
   - print when additional css is loaded
   - test IE

## License 
MIT
