const path = require('path')

module.exports = function (content, map, meta) {
  console.log(11111111, this.resourcePath)
  // console.log('this:', this)
  // const resourcePath = this.resourcePath
  return this.fs._readFileSync(path.resolve(__dirname, '../replace/concat.js'), 'utf-8')
}
