### Computed Vs Methods

虽然在methods中定义相同的函数名可以和computed的属性得到想同的结果，但是computed中的计算结果是会缓存的，除非依赖的data属性变更时才会重新计算，否则得到的就是上次计算的结果，而在methods中的函数，需要每次都运行才会得到结果.


### `v-show`不支持`<template>`

### `v-for`可以迭代一个对象的属性,可以指定第二个参数来表示对象的key    
```
    <div v-for="(value, key) in object">
    	{{index}} {{key}}  {{value}}
    </div>
```

### 当`v-for`和`v-if`在同一个节点上时，`v-for`有更高的执行优先级 
```
    <li v-for="todo in todos" v-if="!todo.isComplete">
    	{{todo}}
    </li>
```
上面的代码只会渲染没有完成的ite

### `v-model`的修饰 比如`v-model.number`,`v-model.trim`    
```
    <input v-model.number="age" type="numer">
    <input v-model.trim="msg">
```
### `$on`和`$emit`不是`addEventListener`和`dispatchment`的别名,尽管它们工作
起来很相似


### 组件作用域规则：在父模板中的一切经过编译后都属于父组件作用域，在子模板中的一切低于属于子组件作用域
