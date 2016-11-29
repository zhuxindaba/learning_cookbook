---
title: 事件处理
categories:
- Vue
---
### 事件的监听    
>可以使用`v-on`指令来监听DOM事件并执行js函数，例如：

```
<div id="example-1">
  <button v-on:click="counter += 1">Add 1</button>
  <p>The button above has been clicked {{ counter }} times.</p>
</div>

var example1 = new Vue({
  el: '#example-1',
  data: {
    counter: 0
  }
})
```

### 事件处理方法    
>如果时间处理函数的逻辑很复杂，那么在`v-on`属性上写js是不可行的，所以`v-on`指令接受一个
>你要执行的方法名：

```
<div id="example-2">
  <!-- `greet` is the name of a method defined below -->
  <button v-on:click="greet">Greet</button>
</div>

var example2 = new Vue({
  el: '#example-2',
  data: {
    name: 'Vue.js'
  },
  // define methods under the `methods` object
  methods: {
    greet: function (event) {
      // `this` inside methods points to the Vue instance
      alert('Hello ' + this.name + '!')
      // `event` is the native DOM event
      alert(event.target.tagName)
    }
  }
})
// you can invoke methods in JavaScript too
example2.greet() // -> 'Hello Vue.js!'
```

### 行内处理方法    
>我们也可以使用行内的js语法而不是直接绑定函数名：

```
<div id="example-3">
  <button v-on:click="say('hi')">Say hi</button>
  <button v-on:click="say('what')">Say what</button>
</div>

new Vue({
  el: '#example-3',
  methods: {
    say: function (message) {
      alert(message)
    }
  }
})
```
>有时候我们需要在行内访问原始DOM的事件，你可以使用`$event`传递给函数：

```
<button v-on:click="warn('Form cannot be submitted yet.', $event)">Submit</button>

//...
methods: {
  warn: function (message, event) {
    // now we have access to the native event
    if (event) event.preventDefault()
    alert(message)
  }
}
```

### 事件修饰符    
>在事件处理中调用`event.preventDefault`或者`event.stopPropagation()`是很常见的需要。
>虽然我们可以在方法中处理，但是保持方法的纯净是很有必要的，我们只需要处理数据相关的逻辑
>不用关心DOM的逻辑，为了解决这个问题，Vue为`v-on`提供了事件修饰符,它由一个后缀`.`表示：
>- .stop
>- .prevent
>- .capture
>- .self

```
<!-- the click event's propagation will be stopped -->
<a v-on:click.stop="doThis"></a>
<!-- the submit event will no longer reload the page -->
<form v-on:submit.prevent="onSubmit"></form>
<!-- modifiers can be chained -->
<a v-on:click.stop.prevent="doThat"></a>
<!-- just the modifier -->
<form v-on:submit.prevent></form>
<!-- use capture mode when adding the event listener -->
<div v-on:click.capture="doThis">...</div>
<!-- only trigger handler if event.target is the element itself -->
<!-- i.e. not from a child element -->
<div v-on:click.self="doThat">...</div>
```

### Key修饰符    
>当监听键盘事件时，我们需要查看key code,Vue也为`v-on`提供了键盘事件的修饰符：

```
<!-- only call vm.submit() when the keyCode is 13 -->
<input v-on:keyup.13="submit">
```
>技术所有的key code是很难的，为此Vue提供了常用key code的别名：

```
<!-- same as above -->
<input v-on:keyup.enter="submit">
<!-- also works for shorthand -->
<input @keyup.enter="submit">
```
>这里是键盘事件的别名列表
>- .enter
>- .tab
>- .delete
>- .esc
>- .space
>- .up
>- .down
>- .left
>- .right
>你也可以通过全局`config.keyCodes`对象自定义键盘事件修饰符：

```
// enable v-on:keyup.f1
Vue.config.keyCodes.f1 = 112
```

### 鼠标事件修饰符    
>2.1.0新出来的，当相关的建按下时，你可以使用一下的别名修饰符监听鼠标事件：
>- .ctrl
>- .alt
>- .shift
>- .meta


### Why Listeners in HTML?     
>你可能关心整个事件监听方式违反了"关注点分离"原则，放心，由于所有的事件处理函数和表达式
>严格的绑定在当前正在处理的视图上，不会引起维护困难，事实上使用`v-on`有以下优点：
>1. 通过略读Html模板可以很容易在js找到事件处理函数
>2. 由于你不用手动在js中添加事件监听，ViewModel代码是纯粹的逻辑，易于测试。
>3. 当ViewModel销毁时，所有的事件监听都会自动的被移除，你不需要自己去清理
