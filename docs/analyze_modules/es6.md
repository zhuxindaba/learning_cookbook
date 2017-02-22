### 为什么使用模块    
1. 代码组织（合理的拆分代码为有逻辑的chunks，而不是写在一个很大的js文件里）
2. 依赖解析(不需要特定的去排列`<script>`的顺序，模块加载器自己知道)
3. 合作(多人合作时不需要解决冲突)
4. 优化(部署代码时，合并为一个文件)

### AMD(Asynchronous Module Defination) e.g. require.js    

### Commonjs nodejs以及Browserify

### ES6模块    
1. 语义清晰
2. 支持循环依赖
3. 模块export的是绑定而不是值    

```
// Commonjs

// counter.js
var count = 0;
function increment () {
  count += 1;
}

exports.count = count;
exports.increment = increment;

// app.js
var counter = require( './counter' ),
    count = counter.count,
    increment = counter.increment;

console.log( count ); // 0
increment();
console.log( count ); // still 0!
```

```
// ES6

// counter.js
export var count = 0;
export function increment () {
  count += 1;
}

// app.js
import { count, increment } from './counter';

console.log( count ); // 0
increment();
console.log( count ); // 1
```

### 更牛逼的特性    
1. multiple exports
> 在Commonjs和Amd中，只能导出一个东西，我们一般是导出一个对象，这个对象上附加了好多属性
> 这是一个问题，也许你仅仅使用了其中的一个函数，但是你的bundle确包含了所有导出的函数。
> ES6模块的语法设计使得绑定器可以更聪明的了解它包含的内容，这也是Rollup的作用。
