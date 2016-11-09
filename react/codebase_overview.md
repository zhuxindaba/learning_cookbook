---
title: 代码库概述
categories: React
---

## 代码库概述    

>这一节主要是给我们一个React代码库的概述，他的一些规范以及实现，如果你想对React有所贡献的话
>这个指南将会使你更加舒服的更改。我们不一定推荐在React应用程序的任何这些惯例，有些惯例由于一些
>历时原因而存在但是后期也许会更改.

### 自定义模块系统(Custom Module System)    

>在Facebook，内部的我们使用的是一个名叫'Haste'的自定义模块，他和commonjs和类似并且也使用`require()`
>但是有一些重要的不同而正是这些使外部的贡献者很困惑。在Commonjs中，当你导入一个模块时，你需要明确指定
>它的相对路径：   

```
// Importing from the same folder:
var setInnerHTML = require('./setInnerHTML');

// Importing from a different folder:
var setInnerHTML = require('../utils/setInnerHTML');

// Importing from a deeply nested folder:
var setInnerHTML = require('../client/utils/setInnerHTML');
```
>然而，在Haste中所有的文件名都是全局唯一的，在React代码库中，你可以按照文件名导入其他的任何模块。
```
var setInnerHTML = require('setInnerHTML');
```
>Haste最初是用来开发大型app的比如像Facebook，很容易将文件移动到不同的目录并且无需担心他们的相对路径
>在任何编辑器的模糊查询会让你得到正确的位置，而这归功于全局唯一的文件名.
>React是从Facebook的代码库中提取出来的，所以使用Haste是历时原因，在将来，我们有可能会移植Commonjs或ES6
>的模块化方式同社区更好的对齐，但是这需要Facebook内部基础架构做出很大改变，所以也不是一朝一夕就能完成的.
>**如果你记得一下这些规则，Haste会对你更有意义：**
>1. 在React原生代码库中的所有文件名都是全局唯一的，这也是为什么有些文件名繁长啰嗦的原因。
>2. 当你添加了一个新文件时，确认你包含了许可证的标头，你可以从别的地方复制一份，一个许可证标头的格式一般是：   

```
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule setInnerHTML
 */
```
>记得更改@providesModule后面的名字，匹配你新创建的文件.
>当我们为npm编译React时，一个script脚本将会复制所有的模块到一个单一的没有子目录的目录，命名为lib
>预制所有的`require()`路径为`./.`,在这种方式下，Node，Browserify，Webpack，等工具将会理解React的生成输出而无需
>关心Haste。
>**如果你正在github上读react源码，并且想跳到某一个文件，请按't'**
>这是Github用来在当前仓库模糊搜索文件的快捷方式，输入你要搜索的文件名，它将会显示匹配的文件。

### 外部依赖    
>React几乎没有外部依赖，通常情况下，`require()`指向的是React自己代码库的文件，但是也有几个比较少见的例外：
>如果你发现`require()`的文件在React仓库中没有所对应的文件，那么你可以在[fbjs](https://github.com/facebook/fbjs)
>这个仓库中找到,例如`require('warning')`将会从fbjs的`warning`模块中解析。
>fbjs仓库存在是因为React共享了一些工具类比如[Relay](https://github.com/facebook/relay),我们保持了他们之间的同步关系.
>我们不依赖Node生态系统的等效小模块，因为我们希望Facebook的工程师在有需要的时候都可以做出改变,所有fbjs内部的实用程序不会被
>作为开放的API，它们的意图仅仅是用来服务于Facebook的项目，比如React。

### 顶级文件夹
>在克隆React仓库之后，你会发现有几个顶级文件夹在里面:
>1. `src`是React的源码，如果你要修改相关的代码，`src`文件夹将是你花费时间最长的.
>2. `docs`是React文档网站，当你修改了API时，请确认修改了相应的markdown文件
>3. `examples`包含了一些生成不同配置的React例子
>4. `packages`包含了元数据用来对应React仓库中的所有包（比如package.json），尽管如此，他们的源码还是位于`src`文件夹中。
>5. `build`是React的生成输出，他不会再React仓库中出现，但是他会出现在你运行生成命令之后.
>还有一些顶级目录，但是他们仅仅是工具类，很有可能你在贡献代码时，根本不会碰到他们。

### 协同定位测试
>我们没有一个顶级的测试目录，我们将测试用例放在一个`__tests__`的目录下代替。
>例如，`setInnerHTML.js`的测试用例放在`__tests__/setInnerHTML-test.js`.

### 共享的代码
>尽管Haste允许我们导入React仓库的任何模块，我们得遵循一个规范用来避免循环依赖以及其他的怪异现象，按照规范，一个文件仅能导入相同
>目录以及子目录下的文件。
>例如：在`src/renders/dom/client`下的文件可以导入相同目录以及该目录的所有子目录中的文件.但是他们不能导入`src/renders/dom/server`
>下的文件因为它不是`src/renders/dom/client`的子目录。
>此规则的例外情况，有时候，我们需要在不同组的模块里共享一些公共的函数，在这种情况下，我们提升共享模块到这些目录最近的父目录里的一个叫
>shared的模块里.
>比如：`src/renders/dom/client`和`src/renders/dom/server`共享一段代码，那么这段代码应该位于`src/renders/shared`.
>按照同样的逻辑，如果`src/renders/dom/client`和`src/renders/native`共享一个工具类，那么此工具类应该位于`src/renders/shared`.
>这个规范虽然不是强制的，但是当我们遇到`pull request`时会检查.

### 警告及不变量
>React代码库用`warning`模块来展示警告：

```
var warning = require('warning');

warning(
  2 + 2 === 4,
  'Math is not working today.'
);
```
>**当`warning`条件为false时，警告将会显示**
>这种思考方式是条件响应的是正常情况而不是异常情况。
>这是一种避免垃圾邮件以及控制台重复输出的好主意。

```
var warning = require('warning');
var didWarnAboutMath = false;
if(!didWarnAboutMath) {
  warning(
    2 + 2 === 4,
    'Math is not working today'
  );
  didWarnAbout = true;
}
```
>警告仅会在开发环境下可用，在正是环境下，他们会被完全削去，如果你需要禁止一些代码路径的执行
>使用`invariant`模块代替.

```
var invariant = require('invariant');
invariant(
  2 + 2 === 4,
  'You shall not pass!'
);
```
>当`invariant`为false的时候，将引发
>"invariant"是这种情况一直为true的一种说明方式，你可以把它当做断言。
>保持开发和正是环境行为一直是很重要的，所以`invariant`可以在正式及开发环境引发，警告信息会自动
>的被替换为错误码以避免字节数大小的影响。

### 开发和正式    
>你可以在代码库使用`__DEV__`伪全局变量，守卫只针对开发环境的代码块。
>在编译阶段中，在CommonJS构建时，它将会被转变为`process.env.NODE_ENV !== 'production'`。
>在独立构建时，在未压缩的构建时它变为true，在压缩构建的时候它将会被剔除。

```
if (__DEV__) {
  // This code will only run in development.
}
```

### JSDoc    
>一些内部的以及公共的方法以[JSDoc形式的注释](http://usejsdoc.org/)注释：

```
/**
  * Updates this component by updating the text content.
  *
  * @param {ReactText} nextText The next text content
  * @param {ReactReconcileTransaction} transaction
  * @internal
  */
receiveComponent: function(nextText, transaction) {
  // ...
},
```
>我们试图让存在的注释更新但我们不是强制的，我们没有在新写的代码中使用JSDoc,替代方案是
>我们使用Flow强制类型.

### Flow    
>我们最近引入[Flow](https://flowtype.org/)来检查代码库，在许可证标头用`@flow`标记的文件
>将会执行类型检查.
>我们接受给已存在代码添加`@flow`的pull请求，Flow注释长这样:

```
ReactRef.detachRefs = function(
  instance: ReactInstance,
  element: ReactElement | string | number | null | false,
): void {
  // ...
}
```
>只要有可能，新提交的代码应该使用Flow注解，你可以在本地运行`npm run flow`来检查你的代码.

### 类和Mixins
>React原来是用ES5编写的，我们已经用[babel](http://babeljs.io/)支持了ES6的特性。包含classes,
>但是，许多React代码还是用ES5写的。
>尤其是，你可能经常看到以下的形式：

```
// Constructor
function ReactDOMComponent(element) {
  this._currentElement = element;
}

// Methods
ReactDOMComponent.Mixin = {
  mountComponent: function() {
    // ...
  }
};

// Put methods on the prototype
Object.assign(
  ReactDOMComponent.prototype,
  ReactDOMComponent.Mixin
);

module.exports = ReactDOMComponent;
```
>这段代码的`Mixin`和React的`mixins`特性并无关系，这只是一种分组在一个对象的方法的方式，这些方法有可能
>在后期获取并附加到别的class上，我们使用了这种方式尽管我们尝试在新代码中避免使用。同等的ES6代码长得是
>这个样子的：

```
class ReactDOMComponent {
  constructor(element) {
    this._currentElement = element;
  }

  mountComponent() {
    // ...
  }
}

module.exports = ReactDOMComponent;
```
>有时候我们会转换ES5代码为ES6代码，然而这对我们来说不是非常重要，因为有一个正在进行的努力，React协调器的实现带有
>少量的面向对象的方法，我们完全不需要使用class。

### 动态注入    
>React在有些模块中使用了动态注入，虽然它易于理解，但是不幸的是，它阻碍了我对代码的理解，它存在的主要原因是React起初
>只支持DOM作为target,React Native是已React的分支开始的，我们不得不添加动态注入让React Native覆盖一些行为.你有可能
>会看见一些模块声明动态依赖是以下面的这种方式:

```
// Dynamically injected
var textComponentClass = null;

// Relies on dynamically injected value
function createInstanceForText(text) {
  return new textComponentClass(text);
}

var ReactHostComponent = {
  createInstanceForText,

  // Provides an opportunity for dynamic injection
  injection: {
    injectTextComponentClass: function(componentClass) {
      textComponentClass = componentClass;
    },
  },
};

module.exports = ReactHostComponent;
```
>`injection`区域无论如何不会被特殊的处理，但是按照惯例，它意味着此模块在运行的时候想注入一些模块，在React DOM中，
>[ReactDefaultInjection](https://github.com/facebook/react/blob/4f345e021a6bd9105f09f3aee6d8762eaa9db3ec/src/renderers/dom/shared/ReactDefaultInjection.js)注入了DOM细节的实现`ReactHostComponent.injection.injectTextComponentClass(ReactDOMTextComponent);`,
>在React Native中[ReactNativeDefaultInjection](https://github.com/facebook/react/blob/4f345e021a6bd9105f09f3aee6d8762eaa9db3ec/src/renderers/native/ReactNativeDefaultInjection.js)注入了它自己的实现,在代码库中有多个注射点，在未来，我们打算拜托动态注入的这种机制，在静态构建时串起所有的碎片文件。

### 大量的包    
>React是一个[monorepo](http://danluu.com/monorepo/),它的仓库包含了大量的独立的包，所以他们的改变可以协调在一起，并且文档以及问题是在一起的，
>`npm`元数据比如`package.json`文件在位于顶层目录`package`文件夹下的，但是，这里面几乎没有代码。
>比如，[packages/react/react.js](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/packages/react/react.js)再导出`src/isomorphic/React.js`,真实的npm入口，其余的包大多数重复相同的规则，所有重要的代码都位于`src`文件夹下。
>虽然在源码结构里代码都是独立的，确切的包的边界还是和npm的以及browser构建略有不同。

### React Core
>React的核心包含了所有顶级的[React API](https://facebook.github.io/react/docs/react-api.html),比如：
>- React.createElement()
>- React.createClass()
>- React.Component
>- React.Children
>- React.PropTypes
> React核心仅仅包含了定义模块的API，不包括reconciliation算法以及具体平台的代码，它被用于React DOM以及React Native，React的核心代码位于`src/isomorphic`
>它可以在npm的react包中获取，相应的browser中是react.js,它导出的全局变量是React。

### Renders
