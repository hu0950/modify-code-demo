const path = require('path')

module.exports = class MyReplacePlugin {
  constructor(source, options, target) {
  }
  apply(compiler) {
    compiler.plugin("compile", (params) => {
      // 当编译器开始编译模块时
      let nmf = params.normalModuleFactory
      nmf.plugin("before-resolve", (data) => {
        // 在factory开始解析模块前
        console.log(111111111, data)
      })
    })
  }
}

// module.exports = class MyReplacePlugin {
//   constructor(source, options, target) {
//   }
//   apply(resolver) {
//     const target = resolver.ensureHook('before-resolved');
//     resolver
//       .getHook(target)
//       .tapAsync("MyReplacePlugin", (request, resolveContext, callback) => {
//         // const descriptionFile = request.descriptionFileData
//         // const packageName = descriptionFile.name
//         // //TODO: 如果符合规则，就替换
//         // request.path = "新文件.js"
//         console.log(111111111)
//         callback()
//       })
//   }
// }

