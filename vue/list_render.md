---
title: Vue的列表渲染
categories:
- Vue
---
### v-for    
>使用`v-for`指令渲染基于数组的列表，`v-for`的语法格式为`item in items`,`items`是data
>里的属性，`item`是每个数组中每个元素的别名。

### 基本用法    
```
<ul id="example-1">
  <li v-for="item in items">
    {{ item.message }}
  </li>
</ul>

var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```
>在`v-for`块里，有到父属性范围的访问权限，`v-for`也支持一个可选的第二个参数，用来表示当前
>元素的索引:

```
<ul id="example-2">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>

var example2 = new Vue({
  el: '#example-2',
  data: {
    parentMessage: 'Parent',
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```
>也可以使用`of`代替`in`作为定界符，这更接近js中迭代器的语法：

```
<div v-for="item of items"></div>
```

### 模板`v-for`    
>和模板`v-if`相似，可以在`<template>`中使用`v-for`用来渲染多个元素的块，比如：

```
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider"></li>
  </template>
</ul>
```

### 对象`v-for`    
>也可以使用`v-for`来迭代一个对象的所有属性：

```
<ul id="repeat-object" class="demo">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>

new Vue({
  el: '#repeat-object',
  data: {
    object: {
      FirstName: 'John',
      LastName: 'Doe',
      Age: 30
    }
  }
})
```
>也可以对这个`key`提供第二个参数：

```
<div v-for="(value, key) in object">
  {{ key }} : {{ value }}
</div>
```
>以及相应的索引：

```
<div v-for="(value, key, index) in object">
  {{ index }}. {{ key }} : {{ value }}
</div>
```

### 范围性的`v-for`    
>`v-for`也接收一个整数，在这种场景中，它会重复渲染此模板多次：

```
<div>
  <span v-for="n in 10">{{ n }}</span>
</div>
```

### 组件和`v-for`    
>可以在自定义组件中使用`v-for`:

```
<my-component v-for="item in items"></my-component>
```
>然而这不会将任何数据自动的传递给组件，因为组件有独立的基于它自己的作用域，为了将一个可迭代
>的数据传递个给组件，需要使用属性：

```
<my-component
  v-for="(item, index) in items"
  v-bind:item="item"
  v-bind:index="index">
</my-component>
```
>不自动注入`item`到组件的原因是这会使组件紧耦合于`v-for`是如何工作的。为了明确data的
>来源并使组件在其他情况下也可复用，这里有个例子：

```
<div id="todo-list-example">
  <input
    v-model="newTodoText"
    v-on:keyup.enter="addNewTodo"
    placeholder="Add a todo"
  >
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:title="todo"
      v-on:remove="todos.splice(index, 1)"
    ></li>
  </ul>
</div>

Vue.component('todo-item', {
  template: '\
    <li>\
      {{ title }}\
      <button v-on:click="$emit(\'remove\')">X</button>\
    </li>\
  ',
  props: ['title']
})
new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: [
      'Do the dishes',
      'Take out the trash',
      'Mow the lawn'
    ]
  },
  methods: {
    addNewTodo: function () {
      this.todos.push(this.newTodoText)
      this.newTodoText = ''
    }
  }
})
```

### key    
>当Vue更新一个由`v-for`渲染的列表时，默认情况下使用的是"原地修补"的策略，如果数据列表的
>顺序改变了，移动DOM元素来匹配最新的顺序，Vue会原地简单的修正每一个元素确保特定索引初应该
>渲染什么。这种默认方式是有效率的，但是只适用于你的列表渲染不依赖于子组件或临时DOM状态（例
如，input输入值）。你需要给每一个节点提供一个唯一的`key`属性，给Vue一个线索以便可以追踪
>每个节点的身份，从而复用且重排序存在的节点.你需要使用`v-bind`来绑定动态的值，在这里使用
>的是简写形式：

```
<div v-for="item in items" :key="item.id">
  <!-- content -->
</div>
```
>不管是否需要建议给`v-for`提供一个`key`,除非迭代的DOM内容很简单，或者你故意依赖默认行为来
>提高性能增益。由于它是Vue标识节点的通用机制，`key`还有其它用途不仅仅是很`v-for`相关联。

### 数组改变的探测    

#### 突变方法    
>Vue包装了观察数组突变的方法，所以它们也会触发视图的更新，包装的方法有：
>- push()
>- pop()
>- shift()
>- unshift()
>- splice()
>- sort()
>- reverse()
>可以在浏览器的控制台中调用这些突变方法，比如： `example1.items.push({ message: 'Baz' })`

#### 替换数组    
>突变方法，顾名思义就是调用这些方法之后改变的是原始数组。和不是突变的方法相比较，比如：
>`filter()`, `concat()`,他们不改变原始数组而是返回一个新数组，当使用非突变方法时，你需
>要用新数组替换原始数组：

```
example1.items = example1.items.filter(function (item) {
  return item.message.match(/Foo/)
})
```
>Vue实现了一些智能的启发式技术来最大化的复用DOM元素，所以替换一个数组是一个非常有效的操作。

#### 警告    
>由于js的限制，Vue不能发现以下数组的改变：
>1. 直接通过索引给数组赋值，比如：`vm.items[indexOfItem] = newValue`
>2. 改变数组的长度。 比如： `vm.items.length = newLength`
>为了克服警告1，下面的两种方式完成的效果和`vm.items[indexOfItem] = newValue`是一样的,
>但是会触发反应系统：

```
// Vue.set
Vue.set(example1.items, indexOfItem, newValue)

// Array.prototype.splice`
example1.items.splice(indexOfItem, 1, newValue)
```
>处理警告2的方式，也使用`splice`:

```
example1.items.splice(newLength)
```

### 排序或筛选结果的显示    
>有时候我们需要显示数字的筛选或排序结果没有必要去重置原始数组，在这种情况下，使用属性的计算
>来返回筛选的或者排序好的数组：

```
<li v-for="n in evenNumbers">{{ n }}</li>

data: {
  numbers: [ 1, 2, 3, 4, 5 ]
},
computed: {
  evenNumbers: function () {
    return this.numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```
>或者：

```
<li v-for="n in even(numbers)">{{ n }}</li>

data: {
  numbers: [ 1, 2, 3, 4, 5 ]
},
methods: {
  even: function (numbers) {
    return numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```
