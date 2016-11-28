---
title: Vue模板语法
categories:
- Vue
---

### 模板语法    
>Vue使用基于HTML的模板语法，允许你以声明式的方式绑定渲染的DOM到Vue实例的data。
>所有的Vue模板是有效的html，它可以被特定兼容性的浏览器及html解析器解析。在引擎下，Vue编
>译模板到虚拟DOM的render函数里，与反应系统相结合，聪明的计算出最小数量的组件重新渲染当
>应用程序state发生变化时，最小数量的DOM操作。如果很熟悉虚拟DOM的概念，并更喜欢原生js的
>特性，可以直接写render函数来代替模板。

### 文本插入    

#### Text    
>最常用的文本绑定就是使用`{{}}`这种格式，比如: `<span>Message: {{ msg }}</span>`
>`{{msg}}`将会替换为相应data对象的属性值，当data的msg属性值改变时，`{{msg}}`也会改变。
>通过使用`v-once`指令让data属性改变时相应的`{{msg}}`不更新。但是记住，这回影响任何在该
>节点绑定的数据。

```
<span v-once>This will never change: {{ msg }}</span>
```

#### 原始html    
>双花括号的语法以文本格式解释data，而不是HTML,如果要输出HTML，使用`v-html`指令.
```
<div id="app">
  <div v-html="raw"></div>
</div>
<script>
  var vue = new Vue({
    el: '#app',
    data: {
    raw: '<p style='color:red'>测试</p>'
  }
  });
</script>
```
>Vue不是基于字符串模板引擎，组件是UI重用和组成首选的基本单位。注意：在网站动态的渲染任何
>HTML是非常危险的，因为会引起XSS攻击，只有使用HTML插入在信赖的内容上并永远不会使用用户提
>供的内容才是安全的。

#### 属性    
>双花括号语法不能使用在HTML的属性中，替换方案是使用`v-bind`命令:

```
<div v-bind:id="dynamicId"></div>
```
>对于boolean类型的属性同样有效，当值为false时，移除此属性：

```
<button v-bind:disabled="someDynamicCondition">Button</button>
```

#### 使用JS表达式    
>Vue支持在数据绑定时使用js表达式，比如:

```
{{ number + 1 }}
{{ ok ? 'YES' : 'NO' }}
{{ message.split('').reverse().join('') }}
<div v-bind:id="'list-' + id"></div>
```
>这样绑定的限制是，在双花括号语法中只能使用一个表达式：

```
<!-- this is a statement, not an expression: -->
{{ var a = 1 }}
<!-- flow control won't work either, use ternary expressions -->
{{ if (ok) { return message } }}
```
>模板表达式是沙箱式的，你可以访问类似`Math`和`Date`的全局变量，但是不能在模板表达式中
>访问用户自定义的全局变量。

#### 指令    
>指令是以`v`为前缀的特殊的属性，指令属性值期望的是一个简单的js表达式，指令的作用就是当表
>达式的值更改时，将响应作用应用到DOM上：

```
<p v-if="seen">Now you see me</p>
```
>当`seen`表达式的值为false时，`v-if`指令将移除`p`元素，反之则插入`p`元素。

#### 参数    
>一些指令可以携带一个参数，它由指令`:`后的名字表示。

```
<a v-bind:href="url"></a>
```
>`href`是一个参数，它告诉`v-bind`指令绑定元素的`href`属性到`url`表达式的值，还有就是
>`v-on`指令，用来监听DOM事件:

```
<a v-on:click="doSomething">
```
>时间名称就是要监听的DOM时间.

#### 修饰符    
>修饰符是一个特殊的后缀又一个`.`表示，它表明一个指令由一种特殊的方式绑定，比如`.prevent`
>让`v-on`指令调用`e.preventDefault()`阻止事件的默认执行。

#### 筛选器    
>Vue.js允许你定义筛选器，可以应用于常见的文本格式，筛选器常用在两个地方,双花括号以及`v-bind`
>表达式，筛选器添加在js表达式的后面，由管道`|`符号表示：

```
<!-- in mustaches -->
{{ message | capitalize }}
<!-- in v-bind -->
<div v-bind:id="rawId | formatId"></div>
```
>注意：Vue2.x的筛选器只能用在双花括号以及`v-bind`表达式中，因为筛选器的主要设计用来文本
>转换的目的，对于更复杂的指令，使用[计算的属性](https://vuejs.org/v2/guide/computed.html)来代替。
>筛选器函数总是接收表达式的值作为第一个参数：

```
new Vue({
  // ...
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
})
```
>筛选器可以使链式的：   

```
{{ message | filterA | filterB }}
```
>筛选器是js函数，所以他们可以接收参数：    

```
{{ message | filterA('arg1', arg2) }}
```
>在这里，`'arg1'`将作为第二个参数传递给filter函数,而`arg2`表达式会评估它的值并作为第三
>个参数传递。

#### 速记    
>频繁的使用`v-`前缀的指令很繁琐，所以Vue提供了两种常用指令的简写方式`v-bind`,`v-on`:

##### `v-bind`的速记方式     
```
<!-- full syntax -->
<a v-bind:href="url"></a>
<!-- shorthand -->
<a :href="url"></a>
```
##### `v-on`的速记方式     
```
<!-- full syntax -->
<a v-on:click="doSomething"></a>
<!-- shorthand -->
<a @click="doSomething"></a>
```
