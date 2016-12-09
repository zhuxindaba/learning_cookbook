---
title: 组件
categories:
- Vue
---
### 什么是组件    
>组件是Vue的最强大的特性之一，他们帮你扩展基于Html元素来封装可复用的代码，在较高的水平上
>组件是自定义元素，是Vue编译器的附加行为。在一些场景中，它们可能在一些原生的Html元素以`is`
>属性的扩展形式出现。

### 使用组件    

#### 注册    
>通过以下方式创建vue实例：

```
new Vue({
  el: '#some-element',
  // options
})
```
>可以使用`Vue.component(tagName, options)`注册一个全局组件,例如：

```
Vue.component('my-component', {
  // options
})
```
>注意：Vue不强制用W3c的规则命名（都小写，使用-连字符），但是遵守这个规则是好的做法。
>只要一注册，组件可以在一个vue实例中作为一个自定义元素使用，`<my-component></my-component>`.
>在初始化vue实例时请确保组件已经注册了。比如：

```
<div id="example">
  <my-component></my-component>
</div>

// register
Vue.component('my-component', {
  template: '<div>A custom component!</div>'
})
// create a root instance
new Vue({
  el: '#example'
})
```
>将会渲染为：

```
<div id="example">
  <div>A custom component!</div>
</div>
```

### 局部注册      
>没有必要将每一个组件都注册为全局的，你可以在一个实例或组件内部通过`components`属性局部的
>使用组件：

```
var Child = {
  template: '<div>A custom component!</div>'
}
new Vue({
  // ...
  components: {
    // <my-component> will only be available in parent's template
    'my-component': Child
  }
})
```


### DOM模板解析警告     
>当使用DOM作为你的模板时（比如：使用`el`选项来装载具有内容的元素），你会受到HTML固有的工作
>限制，因为只有浏览器解析并初始化完成后Vue才会得到模板的内容，最值得注意的是，一些元素比如
>`<ul>`,`<ol>`,`<table>`,`<select>`对他们里面的元素有严格地限制，比如`<option>`只能出现
>在特定元素的里面。当在这些具有严格限制的HTNL元素中使用模板时，该如何做呢：

```
<table>
  <my-row>...</my-row>
</table>
```
>自定义的组件`<my-row>`将会被提升作为合法的内容，但是最终的输出结果会引起错误，使用`is`
>这个属性作为变通方案：

```
<table>
  <tr is="my-row"></tr>
</table>
```
>如果你使用以下的来源是使用字符串模板，将不会受到以上限制：
>- `<script type="text/x-template">`
>- js行内字符串模板
>- `.vue`组件
>因此，尽可能使用字符串模板。

### `data`必须是一个函数    
>模板的`data`必须是一个函数：

```
Vue.component('my-component', {
  template: '<span>{{ message }}</span>',
  data: {
    message: 'hello'
  }
})
```
>Vue将会暂停并在控制台打印错误，告诉你`data`必须是一个函数或者是组件实例，这个规则的存在
>很容易理解：

```
<div id="example-2">
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
</div>

var data = { counter: 0 }
Vue.component('simple-counter', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
  // data is technically a function, so Vue won't
  // complain, but we return the same object
  // reference for each component instance
  data: function () {
    return data
  }
})
new Vue({
  el: '#example-2'
})
```
>由于这三个组件实例共享同一个`data`,当增加其中一个值时所有的值都会增加，通过返回一个全新
>的对象来修复这个问题:

```
data: function () {
  return {
    counter: 0
  }
}
```
>现在每一个组件都有自己的内部状态。

### 组件的组合    
>组件可以在一起使用，最常见的就是父子关系：组件A可能在自己的模板中使用组件B。他们必然会
>互相通信：父组件会给子组件传递`props`,子组件会给父组件报告在子组件内发生了什么。然而通
>过一个明确定义的接口来保持父子组件的解耦也是非常重要的。这可以确保每个组件在相对隔离的情
>况下也可书写与推理，因此书写和维护变得更简单了。在Vue.js中，父子组件的通信可以概括为props
>向下传递，事件向上传递。父组件通过**props**给子组件传递data，子组件通过事件给父组件传递
>消息。


### Props    

#### 通过props传递打他    
>每一个组件实例都有自己的作用域。这意味着你不能在子组件的模板中直接使用父组件的data，父
>组件的data可以通过props传递到子组件。**props**是一个自定义的属性用来传递父组件的信息，
>子组件通过`props`选项来明确的声明它期望获得的数据：

```
Vue.component('child', {
  // declare the props
  props: ['message'],
  // just like data, the prop can be used inside templates
  // and is also made available in the vm as this.message
  template: '<span>{{ message }}</span>'
})

//我们可以这样传递一个简单的字符串给child组件
<child message="hello!"></child>
```

#### 驼峰式vs`-`分界符    
>HTML的属性是不区分大小写的，所以当使用非字符串模板时，驼峰式属性吗需要用他们的'-'分界符
>命名规则来替换：

```
Vue.component('child', {
  // camelCase in JavaScript
  props: ['myMessage'],
  template: '<span>{{ myMessage }}</span>'
})

<!-- kebab-case in HTML -->
<child my-message="hello!"></child>
```
>如果使用的是字符串模板，没有这个限制。

#### 动态的Props    
>和属性绑定普通表达式类似，在父组件中可以使用`v-bind`动态的绑定data和props，不论父组件的
>data是否改变，它始终会传递给子组件：

```
<div>
  <input v-model="parentMsg">
  <br>
  <child v-bind:my-message="parentMsg"></child>
</div>

//使用v-bind的简写形式：
<child :my-message="parentMsg"></child>
```

#### Literal(文本) VS Dynamic    
>一个常犯的错误就是使用文本语法传递一个数字：

```
<!-- this passes down a plain string "1" -->
<comp some-prop="1"></comp>
```
>然而，由于这是一个文本属性，传递的数字是字符串类型的，如果要传递一个js的number类型，我们
>需要使用`v-bind`它会将值预估为js的表达式：

```
<!-- this passes down an actual number -->
<comp v-bind:some-prop="1"></comp>
```

#### 单项数据流    
>在父子组件中所有的数据都是单向流动的：当父组件的属性改变时，它会流向子组件，但是子组件的
>变化不会流向父组件。这样可以阻止子组件意外变化而引起父组件状态的突变，这会让你的应用程序
>很难找到原因。
>另外，任何时候只要父组件更新了，子组件的所有props都会刷新到最近的值，这意味着你不要尝试
>改变子组件的prop，如果你做了，Vue会在控制台警告你。
>通常有两种情况你要改变prop：
>1. prop只是用来传递一个初始值，子组件只是想用它做一个局部的对象属性。
>2. prop作为一个原始值传递
>适当的使用场景是：
>1. 定义一个局部data属性，使用prop's的初始值作为它的值：

```
props: ['initialCounter'],
data: function () {
  return { counter: this.initialCounter }
}
```
>2. 定义一个属性的计算，通过prop's的值计算：

```
props: ['size'],
computed: {
  normalizedSize: function () {
    return this.size.trim().toLowerCase()
  }
}
```
>注意对象和数组是引用传递，所以当传递数组和对象给子组件时，在子组件修改它会影响父组件的
>状态。

#### Prop验证    
>定义一个明确的获得的prop类型是很有用的，如果要求不满足，Vue会报警告，当多人开发时是很
>有用的：

```
Vue.component('example', {
  props: {
    // basic type check (`null` means accept any type)
    propA: Number,
    // multiple possible types
    propB: [String, Number],
    // a required string
    propC: {
      type: String,
      required: true
    },
    // a number with default value
    propD: {
      type: Number,
      default: 100
    },
    // object/array defaults should be returned from a
    // factory function
    propE: {
      type: Object,
      default: function () {
        return { message: 'hello' }
      }
    },
    // custom validator function
    propF: {
      validator: function (value) {
        return value > 10
      }
    }
  }
})
```
>`type`有以下原始类型：
>- String
>- Number
>- Bollean
>- Function
>- Object
>- Array
>另外，`type`可以是自定义构造函数的类型，通过`instanceof`校验。


### 自定义事件    
>子组件如何和父组件通信呢？使用Vue的自定义事件系统。

#### 使用`v-on`来定义事件    
>每一个Vue实例都实现了[事件接口](https://vuejs.org/v2/api/#Instance-Methods-Events),
>- 使用`$on(eventName)`监听事件
>- 使用`$emit(eventName)`触发事件
>注意Vue的事件系统和浏览器的[事件API](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)是分开的。
>尽管他们工作类似，但是`$on`和`$emit`不是`addEventListener`和`dispatchEvent`的别名。
>另外，父组件可以监听子组件使用`$on`发出的事件：

```
<div id="counter-event-example">
  <p>{{ total }}</p>
  <button-counter v-on:increment="incrementTotal"></button-counter>
  <button-counter v-on:increment="incrementTotal"></button-counter>
</div>

Vue.component('button-counter', {
  template: '<button v-on:click="increment">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  },
  methods: {
    increment: function () {
      this.counter += 1
      this.$emit('increment')
    }
  },
})
new Vue({
  el: '#counter-event-example',
  data: {
    total: 0
  },
  methods: {
    incrementTotal: function () {
      this.total += 1
    }
  }
})
```
>**绑定原生事件到组件**
>在`v-on`指令添加后缀`.native`:

```
<my-component v-on:click.native="doTheThing"></my-component>
```

#### form表单组件使用自定义事件    
>使用`v-modle`来创建自定义表单组件：

```
<input v-model="something">
```
>仅仅是语法糖：

```
<input v-bind:value="something" v-on:input="something = $event.target.value">

```
>当在组件中使用时：

```
<custom-input v-bind:value="something" v-on:input="something = arguments[0]"></custom-input>

```
>目前组件与`v-modle`的工作，它必须：
>- 接收一个`value`属性
>- 放射出一个`input`事件

```
<currency-input v-model="price"></currency-input>


Vue.component('currency-input', {
  template: '\
    <span>\
      $\
      <input\
        ref="input"\
        v-bind:value="value"\
        v-on:input="updateValue($event.target.value)"\
      >\
    </span>\
  ',
  props: ['value'],
  methods: {
    // Instead of updating the value directly, this
    // method is used to format and place constraints
    // on the input's value
    updateValue: function (value) {
      var formattedValue = value
        // Remove whitespace on either side
        .trim()
        // Shorten to 2 decimal places
        .slice(0, value.indexOf('.') + 3)
      // If the value was not already normalized,
      // manually override it to conform
      if (formattedValue !== value) {
        this.$refs.input.value = formattedValue
      }
      // Emit the number value through the input event
      this.$emit('input', Number(formattedValue))
    }
  }
})
```
>上面的这个例子很天真，可以参考[这个](https://jsfiddle.net/chrisvfritz/1oqjojjx/?utm_source=website&utm_medium=embed&utm_campaign=1oqjojjx)

### 非父子组件通信    
>当两个不是父子关系的组件该如何通信呢？一个简单的场景，你可以创建一个vue空实例作为中央事
>件汽车：

```
var bus = new Vue()

// in component A's method
bus.$emit('id-selected', 1)


// in component B's created hook
bus.$on('id-selected', function (id) {
  // ...
})
```
>在更复杂的场景中，可以采用专门的[事件管理模式](https://vuejs.org/v2/guide/state-management.html)


### 内容分发槽     
>当使用组件时，经常想要组合他们：

```
<app>
  <app-header></app-header>
  <app-footer></app-footer>
</app>
```
>需要注意两件事：
>1. `<app>`组件不知道在其内部要呈现的内容是什么.
>2. `<app>`组件看起来像是有自己的模板。
>使用特殊的`<slot>`元素。

### 编辑范围     
>想象一个这样的模板：

```
<child-component>
  {{ message }}
</child-component>
```
>`message`会绑定到父组件的data还是子组件的data么？它会绑定到父组件的data。组件范围的一个
>规则是：
>在父模板中的一切都是在父模板范围内编译，在模板就是在子模板范围内编译。
>一个常见的错误就是尝试在子模板中绑定一个子模板的property/method:

```
<!-- does NOT work -->
<child-component v-show="someChildProperty"></child-component>
```
>假设`someChildProperty`是子组件的prop,上面的例子不能运行，因为父模板不会意识到子组件的
>状态。如果你需要绑定子范围的指令到一个组件的根节点上，你需要在子组件范围的模板上绑定：

```
Vue.component('child-component', {
  // this does work, because we are in the right scope
  template: '<div v-show="someChildProperty">Child</div>',
  data: function () {
    return {
      someChildProperty: true
    }
  }
})
```

### 单个插槽    
>父内容将会被抛弃除非子组件模板上至少包含一个`<slot>`插槽。当只有一个没任何属性的插槽时，
>全部内容都会被替换。`<slot>`的原始内容会被作为回退内容，如果持有组件是空的或者没有内容
>金额插入式回退内容才会显示。有一个`<my-component>`的组件：

```
<div>
  <h2>I'm the child title</h2>
  <slot>
    This will only be displayed if there is no content
    to be distributed.
  </slot>
</div>
```
>当一个父组件使用它时：

```
<div>
  <h1>I'm the parent title</h1>
  <my-component>
    <p>This is some original content</p>
    <p>This is some more original content</p>
  </my-component>
</div>
```
>渲染结果是：

```
<div>
  <h1>I'm the parent title</h1>
  <div>
    <h2>I'm the child title</h2>
    <p>This is some original content</p>
    <p>This is some more original content</p>
  </div>
</div>
```

### 命名的插槽    
>`<slot>`有一个`name`属性，用来进一步定义内容如何被分配，你可以有多个不同名字的`<slot>`,
>命名的`<slot>`将会匹配任何有相应的`slot`属性的元素。如果有没有名字的`<slot>`,它会匹配
>任何没有被匹配上的内容，如果没有默认的`<slot>`,没有匹配上的内容将会被放弃。

```
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```
>父标记：

```
<app-layout>
  <h1 slot="header">Here might be a page title</h1>
  <p>A paragraph for the main content.</p>
  <p>And another one.</p>
  <p slot="footer">Here's some contact info</p>
</app-layout>
```
>渲染的结果是：

```
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```
>当设计组件组合时内容分发是一个有用的机制。

### 限定作用域的Slot    
>2.1.0新出现的，限定作用域的slot是一种特殊的类型，作为一种可重用的模板用来代替已经渲染了
>的元素。在子组件中，传递data给一个slot：

```
<div class="child">
  <slot text="hello from child"></slot>
</div>
```
>在父组件中，`<template>`元素会持有一个特殊的`scope`属性来表示它是一个限定作用域的slot
>模板，作用域的值是一个临时变量来掌控从子组件传递过来的data：

```
<div class="parent">
  <child>
    <template scope="props">
      <span>hello from parent</span>
      <span>{{ props.text }}</span>
    </template>
  </child>
</div>
```
>它的渲染结果是：

```
<div class="parent">
  <div class="child">
    <span>hello from parent</span>
    <span>hello from child</span>
  </div>
</div>
```
>列表中如何使用slot呢?

```
<my-awesome-list :items="items">
  <!-- scoped slot can be named too -->
  <template slot="item" scope="props">
    <li class="my-fancy-item">{{ props.text }}</li>
  </template>
</my-awesome-list>
```
>list组件模板：

```
<ul>
  <slot name="item"
    v-for="item in items"
    :text="item.text">
    <!-- fallback content here -->
  </slot>
</ul>
```

### 动态的组件    
>通过`is`属性动态的切换预定了的组件：

```
var vm = new Vue({
  el: '#example',
  data: {
    currentView: 'home'
  },
  components: {
    home: { /* ... */ },
    posts: { /* ... */ },
    archive: { /* ... */ }
  }
})


<component v-bind:is="currentView">
  <!-- component changes when vm.currentView changes! -->
</component>
```
>或者直接绑定组件对象：

```
var Home = {
  template: '<p>Welcome home!</p>'
}
var vm = new Vue({
  el: '#example',
  data: {
    currentView: Home
  }
})
```

#### 保持活跃`keep-alive`    
>如果你想在内存中保存切换出去的组件以避免重新渲染，可以使用`<keep-alive>`元素包装它：

```
<keep-alive>
  <component :is="currentView">
    <!-- inactive components will be cached! -->
  </component>
</keep-alive>
```
>在[API引用](https://vuejs.org/v2/api/#keep-alive)查阅详细信息

### 编写可重用组件    
>当编写组件时应该思考后期会不会重用该组件，编写一次性的组件会紧耦合，编写可重用组件需要
>思考写什么东西呢？有以下三点
>- Props 允许外部环境传递props给组件
>- Events 允许在外部环境触发事件
>- Slots 允许外部环境组合具有额外内容的组件
>在模板中可以清晰的传达出你的意图：

```
<my-component
  :foo="baz"
  :bar="qux"
  @event-a="doThis"
  @event-b="doThat"
>
  <img slot="icon" src="...">
  <p slot="main-text">Hello!</p>
</my-component>
```

### 子组件引用    
>不管存在的props和events，有时候你需要在js中直接访问子组件，为了完成这个目标你需要给子组
>件分配一个ref ID，然后通过`ref`来引用：

```
<div id="parent">
  <user-profile ref="profile"></user-profile>
</div>

var parent = new Vue({ el: '#parent' })
// access child component instance
var child = parent.$refs.profile
```
>当`ref`和`v-for`一起使用时，你得到的ref将会是一个对象或数组,包含了子组件元数据的镜像。
>注意：`$refs`在组件渲染之后才存在，并且它不是反应式的。你应该避免在模板以及属性计算中
>使用`$refs`


### 异步组件    
>在大型app中，我们会把组件拆成一个块，只有当需要的时候才会加载它，在Vue中很简单：

```
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // Pass the component definition to the resolve callback
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```
>当从服务器得到组件的定义时调用`resolve`函数，调用`reject`表示获取组件定义失败。建议的
>方式是使用[Webpack的代码拆分特性](http://webpack.github.io/docs/code-splitting.html):

```
Vue.component('async-webpack-example', function (resolve) {
  // This special require syntax will instruct Webpack to
  // automatically split your built code into bundles which
  // are loaded over Ajax requests.
  require(['./my-async-component'], resolve)
})
```
>使用Es6语法：

```
Vue.component(
  'async-webpack-example',
  () => System.import('./my-async-component')
)
```

### 组件命名惯例    
>你可以使用驼峰式，`-`分界符等，Vue不关注这些：

```
// in a component definition
components: {
  // register using kebab-case
  'kebab-cased-component': { /* ... */ },
  // register using camelCase
  'camelCasedComponent': { /* ... */ },
  // register using TitleCase
  'TitleCasedComponent': { /* ... */ }
}
```
>在html的模板，需要使用`-`分界符命名规则：

```
<!-- alway use kebab-case in HTML templates -->
<kebab-cased-component></kebab-cased-component>
<camel-cased-component></camel-cased-component>
<title-cased-component></title-cased-component>
```
>在字符串模板中也没有什么限制：

```
<!-- use whatever you want in string templates! -->
<my-component></my-component>
<myComponent></myComponent>
<MyComponent></MyComponent>
```
>如果你的模板不通过插槽传递内容，可以自闭合：

```
<my-component/>
```
>注意：这个只能在字符串模板中 使用。

### 递归组件    
>在组建内部可以通过他们的模板来循环调用自己，这个是通过`name`选项工作的：

```
name: 'unique-name-of-my-component'
```
>当你使用`Vue.component`注册了一个全局组件，这个全局Id自动设置为组建的名字：

```
Vue.component('unique-name-of-my-component', {
  // ...
})
```
>如果不小心，很有可能会引起无限循环：

```
name: 'stack-overflow',
template: '<div><stack-overflow></stack-overflow></div>'
```
>这样会引起栈溢出的，所以确保循环是有条件的。

### 组件之间的相互引用    
>如果你在构建一个文件目录树，你有一个`tree-foler`组件有这样的一个模板：

```
<p>
  <span>{{ folder.name }}</span>
  <tree-folder-contents :children="folder.children"/>
</p>
```
>然后`tree-folder-contents`持有这样的一个模板：

```
<ul>
  <li v-for="child in children">
    <tree-folder v-if="child.children" :folder="child"/>
    <span v-else>{{ child.name }}</span>
  </li>
</ul>
```
>当你仔细看，会发现循环依赖了，也就是A need B， B need A等等，利用`beforeCreate`来解决
>这个问题：

```
beforeCreate: function () {
  this.$options.components.TreeFolderContents = require('./tree-folder-contents.vue')
}
```

### 行内模板    
>建议在组建中通过`template`使用模板。

### X-Templates    
>用`text/x-template`:

```
<script type="text/x-template" id="hello-world-template">
  <p>Hello hello hello</p>
</script>

Vue.component('hello-world', {
  template: '#hello-world-template'
})
```
>这个也不建议使用，因为它分离了组件的其它定义。

### Cheap Static Components with v-once    
>在Vue中渲染简单的Html元素是很快的，但是有时候你需要渲染一个包含大量静态内容的组件。在这
>种情况下可以使用`v-once`指令到根元素来解析一次并缓存：

```
Vue.component('terms-of-service', {
  template: '\
    <div v-once>\
      <h1>Terms of Service</h1>\
      ... a lot of static content ...\
    </div>\
  '
})
```
