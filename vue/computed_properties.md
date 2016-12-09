---
title: Vue属性的计算及监听器
categories:
- Vue
---
### Vue属性计算及监听器    

### 属性计算    
>模板内使用表达式是很方便的，但只是对于简单的操作。如果在模板中放入大量的逻辑，只会让模板
>变得庞大且难以管理：

```
<div id="example">
  {{ message.split('').reverse().join('') }}
</div>
```
>你需要看一会才知道这个模板显示的是倒序的字符串，如果你要在模板中多次使用的话，这会变得很
>糟糕。对于复杂逻辑，应该使用属性的计算。

### 基本示例    

```
<div id="example">
  <p>Original message: "{{ message }}"</p>
  <p>Computed reversed message: "{{ reversedMessage }}"</p>
</div>

<script>
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Hello'
  },
  computed: {
    // a computed getter
    reversedMessage: function () {
      // `this` points to the vm instance
      return this.message.split('').reverse().join('')
    }
  }
})
</script>
```
>在这里我们已经宣布了一个计算的属性`reversedMessage`,我们提供的这个函数和属性的getter函数
>类似`rm.reversedMessage`:

```
console.log(vm.reversedMessage) // -> 'olleH'
vm.message = 'Goodbye'
console.log(vm.reversedMessage) // -> 'eybdooG'
```
>`vm.reversedMessage`的值依赖于`vm.message`的值。你可以将计算的属性像普通属性一样绑定到
>模板上，Vue会意识到`vm.reversedMessage`依赖`vm.message`,所以当`vm.message`改变的时候
>修改对应绑定的`vm.reversedMessage`的值，当然最好的部分是我们已经以声明的方式创建了依赖
>关系:计算的getter函数是纯函数并且没有副作用，这样可以很轻松的测试。

### 计算的缓存VS方法    
>你可能已经注意到我们可以通过在表达式中调用方法得到相同的结果：

```
<p>Reversed message: "{{ reverseMessage() }}"</p>

<script>
// in component
methods: {
  reverseMessage: function () {
    return this.message.split('').reverse().join('')
  }
}
</script>
```
>我们可以定义一个方法来代替属性的计算。对于最终结果，这两种方式确实完全相同。但是，不同之
>处是，计算的属性会缓存基于它的依赖，一个计算的属性只有当它的依赖项发生改变时才会重新计算
>这意味着只要`message`没有改变，多次访问计算的属性`reversedMessage`会返回上次计算的结果
>而不是重新运行该函数。下面的计算的属性永远不会发生变化，因为`Date.now()`不是一个反应式
>的依赖项：

```
computed: {
  now: function () {
    return Date.now()
  }
}
```
>作为比较，不管是否重新渲染，一个方法的调用都需要重新运行该方法。我们为什么需要缓存呢？
>想象一个非常耗时的计算属性A，它需要在一个很大的数组中循环并且进行大量的计算，然后可能有
>其余的计算属性依赖于A的计算属性，如果没有还从的话，我们将毫无必要的执行多次A的计算，当在
>不需要使用缓存的情况下，使用方法代替。

### 计算的属性VS监听的属性    
>Vue确实提供了一种通用的方法来观察Vue实例中data的变化做出反应：`watch properties`.当你
>的一些数据需要基于其它一些数据做出改变时，可以尝试使用`watch`属性。但是使用属性的计算相对
>来说更好一点，考虑下面的例子：

```
<div id="demo">{{ fullName }}</div>

<script>
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar',
    fullName: 'Foo Bar'
  },
  watch: {
    firstName: function (val) {
      this.fullName = val + ' ' + this.lastName
    },
    lastName: function (val) {
      this.fullName = this.firstName + ' ' + val
    }
  }
})
</script>
```
>上面的代码有重复，和属性的计算相比较：

```
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar'
  },
  computed: {
    fullName: function () {
      return this.firstName + ' ' + this.lastName
    }
  }
})
```
>这样更好一点。

### 计算属性的Setter    
>默认情况下计算的属性时只读的，但是当你需要时你可以提供一个setter函数：    

```
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
```
>现在当你执行`vm.fullName = 'John Doe'`,setter函数将会被执行，相应的`vm.firstName`和
`vm.lastName`也会改变。

### 监听器    
>虽然在多数情况下，属性的计算是很合适的，但是有时候自定义监听器也是有必要的。这也是为什么
>Vue提供了一个同用的方式，通过`watch`选项来对数据的变化做出反应。当你要响应不断变化的数据
>执行异步操作或者昂贵操作的时候很有用。例如：

```
<div id="watch-example">
  <p>
    Ask a yes/no question:
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>

<!-- Since there is already a rich ecosystem of ajax libraries    -->
<!-- and collections of general-purpose utility methods, Vue core -->
<!-- is able to remain small by not reinventing them. This also   -->
<!-- gives you the freedom to just use what you're familiar with. -->
<script src="https://unpkg.com/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://unpkg.com/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: 'I cannot give you an answer until you ask a question!'
  },
  watch: {
    // whenever question changes, this function will run
    question: function (newQuestion) {
      this.answer = 'Waiting for you to stop typing...'
      this.getAnswer()
    }
  },
  methods: {
    // _.debounce is a function provided by lodash to limit how
    // often a particularly expensive operation can be run.
    // In this case, we want to limit how often we access
    // yesno.wtf/api, waiting until the user has completely
    // finished typing before making the ajax request. To learn
    // more about the _.debounce function (and its cousin
    // _.throttle), visit: https://lodash.com/docs#debounce
    getAnswer: _.debounce(
      function () {
        var vm = this
        if (this.question.indexOf('?') === -1) {
          vm.answer = 'Questions usually contain a question mark. ;-)'
          return
        }
        vm.answer = 'Thinking...'
        axios.get('https://yesno.wtf/api')
          .then(function (response) {
            vm.answer = _.capitalize(response.data.answer)
          })
          .catch(function (error) {
            vm.answer = 'Error! Could not reach the API. ' + error
          })
      },
      // This is the number of milliseconds we wait for the
      // user to stop typing.
      500
    )
  }
})
</script>
```
>在这个场景中，使用`watch`选项允许我们执行异步操作，限制多久执行操作，以及只有获取到数据
>才设置state。而这些在属性计算都是不可用的。除了这个选项你还可以使用必要的[vm.$watch API](https://vuejs.org/v2/api/#vm-watch)
