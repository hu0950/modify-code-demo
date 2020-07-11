### 一、借助Webpack的相关能力
#### 1. loader：利用loader可以将匹配到的文件进行转换的特性，对匹配到的文件进行处理。

  - 具体实现：
  > 匹配要修改源码的路径，指定要转换的loader文件
   ```javascript
    // webpack配置文件
    rules: [{ 
        test: /\.js$/,
        // 要修改的源码的路径
        include: resolve('./node_modules/lodash/concat.js'),
        use: {
          // 使用该loader对匹配到的文件进行转换
          loader: resolve('./loaders/modify-loader.js')
        }
      }
    ]
   ```

   > 在loader文件中，对匹配到的文件进行处理，并返回转换（替换）后的文件

   ```javascript
    const path = require('path')
    module.exports = function (content, map, meta) {
      // const resourcePath = this.resourcePath
      // replace/concat.js -> 源码lodash/concat.js的替换文件
      return this.fs._readFileSync(path.resolve(__dirname, '../replace/concat.js'), 'utf-8')
    }
   ```
  - 思考：改动成本低，可追溯修改的diff，但从一定程度上会导致项目增加黑盒逻辑。

#### 2. plugin
  a. 借助Webpack内置的插件NormalModuleReplacementPlugin
  - 如果替换的文件中有相对路径，会找不到相对的上下文，会有问题（TODO：待讨论）
  - 参考：https://webpack.js.org/plugins/normal-module-replacement-plugin/#basic-example
  b. resolve plugin
  
  // TODO:待实践，写插件
  ```javascript
  module.exports = class MyReplacePlugin {
    constructor(source, options, target) {
    }
    apply(resolver) {
      const target = resolver.ensureHook('before-resolved');
      resolver
        .getHook(target)
        .tapAsync("MyReplacePlugin", (request, resolveContext, callback) => {
          const descriptionFile = request.descriptionFileData
          const packageName = descriptionFile.name
          //TODO: 如果符合规则，就替换
          request.path = "新文件.js"
          callback()
        })
    }
  }
  ```
  
#### 3. resolve.alias
  - 思路：通过别名，将源码里面引用模块的路径替换成修改后的本地文件。即使访问引用源码的模块时，其实是访问修改后的本地文件
  - 具体实现：
    - 找到别人源码里面的需要修改的模块，复制代码到src目录
    - 修改其中的bug，注意里面引用其他的文件都需要写成绝对路径
    - 找到这个模块被引入的路径（我们需要拦截的路径）
    - 配置webpack alias
  - 思考：需要考虑设置别名的文件路径引用，在项目中是否是唯一的，是否会引起其他冲突的问题；以及可能不适用于修改的不是入口文件，而是入口引用文件的情况。
#### 4. jscodeshift + loader
  - 利用jscodeshift可以修改源码的AST的特性。在要魔改的函数处，增加hook。另外，再通过loader的方式，找到对应的hook的函数，采用jscodeshift修改代码。
  
  // TODO：待实践
  ```javascript
    const fs = require('fs')
    const j = require('jscodeshift')
    module.exports = function (content, map, meta) {
      console.log('this:', this)
      const resourcePath = this.resourcePath
      //TODO 匹配，是否需要替换
      // demo 在 function something(){// }// 的第一句前插入一个hook
      const oldSource = content
      const root = j(oldSource)
      root
      .find(j.FunctionDeclaration, {
        id: {
        name: 'something'
        }
      })
      .find(j.BlockStatement)
      .find(j.Statement)
      .insertBefore('window._myHook && window._myHook();')
      const newSource = root.toSource()
      return newContent
    }
  ```
  - 适用于已经打包成dist的单个文件，如果文件不是很大的话，魔改的地方少。改写AST，需要慎重。

#### 5. 为依赖包创建补丁-使用 Patch Package 魔改第三方 NPM 包
- 具体步骤：
  1. 安装 patch-package: npm i patch-package -D
  2. 在 package.json 的 scripts 中增加如下命令："postinstall": "patch-package"
  3. 根据代码定位的位置，在node_modules下相应文件中修改
  4. [首次修改源码]执行npx patch-package [package-name] 生成 patch 文件，并将 patch 文件加入到 git 中
  5. [根据patch文件更新源码]执行npm run postinstall
   
- Tip：在过程中，可能会遇到xcrun: error报错的问题，解决方案：执行xcode-select --install，更新xcode即可

- 思考：
  1. 根据目前的远程编译上线的方式，还需要在上线脚本中执行npm run postinstall，才能及时更新远程依赖。同时，编写脚本时，还需要增加对不需要执行postinstall项目的考虑，避免对其它项目的上线造成影响。
  2. 不影响依赖库正常升级，涉及到修改的内容会用补丁替换
  3. 适用场景：适合比较少修改的场景

- 参考：https://juejin.im/post/5e7de6c3518825738e215c2d


### 二、在项目运行时修改
#### 6. 在项目中直接重写有问题的方法
- 改动成本低，灵活度高，可追溯修改的diff
- 适用于无法更改源文件，比如：引用的是cdn或是已编译打包好的资源

### 三、基于新的拷贝项目修改
#### 7. npm安装本地文件
- copy依赖包的代码作为本地文件
- 安装如：npm i --save ./cube-ui cube-ui

#### 8. fork包源码，修改后，并发布成新包
思考：
- 无法追溯与源代码的diff
- 改动代码少，但需要对整份代码进行变更（或许需要额外的构建和发布成本）
- 适用场景：改动很大，无法在原有库中开发；此次变更是可用于其它项目的；将来会提PR
  
### 四、借助 node
#### 10. 借助node有可读写文件的能力，结合npm script，进行文件替换






