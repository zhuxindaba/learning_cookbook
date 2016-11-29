---
title: 条件渲染
categories:
- Vue
---
### v-if    
>在字符串模板中，我们需要按照下面的方式写一个条件块：

```
<!-- Handlebars template -->
{{#if ok}}
  <h1>Yes</h1>
{{/if}}
```
>在Vue中，我们使用`v-if`指令来得到相同的效果：

```
<h1 v-if="ok">Yes</h1>
```
>当然可以使用`v-else`指令来添加"else"块：

```
<h1 v-if="ok">Yes</h1>
<h1 v-else>No</h1>
```

### 在<template>中添加`v-if`条件组    
>因为`v-if`是一个指令，它需要附属在一个元素上，但是当我们需要切换不止一个元素时怎么办呢？
>在这种情况下，我们需要使用在`<template>`中使用`v-if`，作为一个看不见的包装，最终的渲染
>结果是不包含`<template>`元素：

```
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```
#### v-else    
>可以使用`v-else`指令来指出一个`v-if`的"else 块"：

```
<div v-if="Math.random() > 0.5">
  Now you see me
</div>
<div v-else>
  Now you don't
</div>
```
>`v-else`指令必须跟在`v-if`或`v-else-if`元素后面，否则它不会起作用。

#### v-else-if    
>在2.1.0中新添加的特性，可以多次链式的使用：

```
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```
>同样必须跟在`v-if`或`v-else-if`元素后面。

### 通过`key`控制元素的复用    
>Vue尝试尽可能高效的渲染元素，经常重新使用它们而不是重新从零开始渲染他们，为了使Vue更快
>这儿有一些有用的优点，比如，允许用户切换等了类型：

```
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address">
</template>
```
>然后切换`loginType`,将不会擦除用户已经输入的内容，因为两个模板都使用了同一个`<input>`
>改变的仅仅是`placeholder`.这样不是很好，Vue提供了一种方式来完善这个缺点，只需要添加
>一个唯一的`key`属性：

```
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username" key="username-input">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address" key="email-input">
</template>
```
>注意`<label>`还是会重用的，因为它们有`key`属性。

#### v-show    
>`v-show`是一个有条件显示一个元素的指令，它的用法：

```
<h1 v-show="ok">Hello!</h1>
```
>区别是一个带有`v-show`的元素会在DOM中渲染并保留在DOM中，`v-show`仅仅是改变元素的`display`
>属性，**注意:**,`v-show`不支持`<template>`，与不与`v-else`一起工作。

#### v-if vs v-show    
>`v-if`条件为真时才渲染因为他要保证在切换过程中事件监听以及子组件正确的销毁并重建。
>`v-if`是"懒惰的",如果在初始渲染时，条件为false，它不会干任何事，只有当条件为true时，
>才会渲染。
>`v-show`的元素会不管初始条件渲染，它仅仅是基本的CSS切换。
>通常来讲，`v-if`切换时有较高的消耗，而`v-show`在初始化的时候有较高的消耗，如果你需要经常
>切换选择`v-show`,如果在运行时不太可能改变则选择`v-if`
