// https://github.com/michael-ciniawsky/postcss-load-config
var path = require('path')
var importPath = [path.resolve(__dirname, './src')]

module.exports = {
  "plugins": {
    // to edit target browsers: use "browserslist" field in package.json
    // "autoprefixer": {}
    // "postcss-at-rules-variables": {},
    "postcss-import": { path: importPath },
    "postcss-apply": {},
    "postcss-salad": {}
  }
}
