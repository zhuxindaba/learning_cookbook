---
title: 样式绑定
categories:
- Vue
---
### Class和Style的绑定    
>对数据绑定的共同需求是操纵元素的列表样式及行内样式，由于他们都是属性，可以通过`v-bind`
>来处理他们。当`v-bind`绑定的是`class`以及`style`时，除了字符串，表达式也可以被评估为
>对象或者数组。

### 绑定HTML的类    

#### 对象语法    
>我们可以传递一个对象给`v-bind:class`来动态的切换class：

```
<div v-bind:class="{ active: isActive }"></div>
```
>上面的语法意味着class的存在由`isActive`是否为真决定。可以通过对象中的多个字段来切换多个
>类，另外`v-bind:class`指令可以与`class`属性共同存在，下面的例子：

```
<div class="static"
     v-bind:class="{ active: isActive, 'text-danger': hasError }">
</div>
```
>以及相应的数据对象：

```
data: {
  isActive: true,
  hasError: false
}
```
>它的渲染结果是：

```
<div class="static active"></div>
```
>当`isActive`和`hasError`改变时，类列表页会相应的变化，比如，当`hasError`为`true`时，
>相应的类列表会变为`"static active text-danger"`.
>绑定的对象不一定非得内联：

```
<div v-bind:class="classObject"></div>

data: {
  classObject: {
    active: true,
    'text-danger': false
  }
}
```
>渲染结果是相同的，我们也可以绑定一个返回对象的计算属性，例如：

```
<div v-bind:class="classObject"></div>
data: {
  isActive: true,
  error: null
},
computed: {
  classObject: function () {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal',
    }
  }
}
```

#### 数组语法    
>我们可以传递一个数组给`v-bind:class`应用于类列表：

```
<div v-bind:class="[activeClass, errorClass]">

data: {
  activeClass: 'active',
  errorClass: 'text-danger'
}
```
>它的渲染结果是:

```
<div class="active text-danger"></div>
```
>如果你想在列表中有条件的切换类，你可以使用三元运算符：

```
<div v-bind:class="[isActive ? activeClass : '', errorClass]">
```
>`errorClass`会一直应用，但是只有当`isActive`为真时`activeClass`才会被应用。但是当你
>有多个条件切换的类在列表中会有点罗嗦，可以在列表语法中使用对象语法：

```
<div v-bind:class="[{ active: isActive }, errorClass]">
```

### With Components    
>当你在自定义组建中使用`class`属性时，类将会被添加到组件的根节点上，该元素已存在的类不会
>被覆盖，比如，你这么声明一个组件：

```
Vue.component('my-component', {
  template: '<p class="foo bar">Hi</p>'
})
```
>在使用它时又添加了一些类：

```
<my-component class="baz boo"></my-component>
```
>最终的渲染结果是：

```
<p class="foo bar baz boo">Hi</p>
```
>对于类绑定也是同样的效果：

```
<my-component v-bind:class="{ active: isActive }"></my-component>
```
>当`isActive`为true时，渲染结果为：

```
<p class="foo bar active"></p>
```

### 行内样式的绑定    

#### 类语法    
>`v-bind:style`的对象语法简单易懂，看起来很像CSS，你可以使用驼峰式或者"-"形式的属性命名:

```
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>

data: {
  activeColor: 'red',
  fontSize: 30
}
```
>直接绑定一个样式对象让模板看起来很干净是一个好主意：

```
<div v-bind:style="styleObject"></div>

data: {
  styleObject: {
    color: 'red',
    fontSize: '13px'
  }
}
```
>对象语法经常结合返回对象的计算属性来使用。

#### 数组语法    
>`v-bind:style`的数组语法允许你对一个元素应用多个样式对象：

```
<div v-bind:style="[baseStyles, overridingStyles]">
```

#### Auto-prefixing(自动添加前缀)    
>当你在`v-bind:style`中使用一个需要添加供应商前缀的属性时，Vue会自动的检测出并且添加一个
>合适的前缀来应用该样式，比如`transform`
