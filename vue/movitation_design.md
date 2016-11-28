---
title: 了解Vue
categories:
- Vue
---
### 介绍     
>vue是一个用来构建交互式web界面的库。它的核心集中于视图层，它很容易与其他库或现有的项目集成。
>另一方面，Vue完全有能力服务员复杂的单页面应用。但是Vue和其它的框架有什么不同呢？

### 和React的比较    
>React和Vue有很多相似之处:
>- 利用虚拟DOM
>- 提供了reactive(反应性)和可组合的视图组件
>在代码核心库中，保持对相关库管理的routing，全局state的关注。作用域也很相似。我们想保证的不仅
>有技术上的准确也要确保技术的平衡，我们找出React哪里优于Vue，比如，React庞大的生态圈以及
>自定义渲染器的丰富性。

##### 性能（渲染性能）    
>Vue胜过React，当渲染UI时，DOM的操作通常是非常昂贵的，没有库可以使那些原生的操作更快，我们能做的
>最好的就是:
>1. 尽量减少必要的DOM变化的数量，React和Vue都使用了虚拟DOM来解决这个问题。
>2. 尽可能在顶层的DOM操作上添加较小的开销(纯js计算)，这里是React和Vue的区别。
>javascript开销和计算必要的DOM操作机制有直接关系，Vue和React都利用虚拟DOM来达到它，但是Vue的实现更
>轻量级，因此比React的开销更少。
>React和Vue都提供了功能组件，他们是stateless，instanceless的因此需要的开销很少。当它们用于性能关键
>的场景中，Vue更快，为了证明这个，我们渲染1万个item100次，强烈建议自己实践，因为它和软件、浏览器相关。
>相关比较如下:

```
                  Vue       React
Fatest            23ms      63ms
Mediam            42ms      81ms
Average           51ms      94ms
95thPerc.         73ms      164ms
Slowest           343ms     453ms
```

##### 更新性能    
>在React中，当一个组件的state改变了，它会触发整个组件的sub-tree的重新渲染，为了避免child组件不必要
>的渲染，你需要在该组件中使用`shouldComponentUpdate`并定义不变的结构，而在Vue中，在渲染过程中，会自
>动的追踪组件的依赖项，所以系统会精确的知道哪个组件需要正真的重新渲染。这就意味着未优化的Vue比未优化的
>React要快。由于Vue的加强了渲染性能，即使React进行了全部的优化操作，通常也比Vue慢。

##### 在开发过程中     
>虽然在生产环境中的性能指标是非常重要的，因为这和用户体验相关联。但是在开发时的性能仍然重要，因为这与
>我们开发者相关联.
>Vue和React在大多数程序中开发可以保持足够快速。但是，在高帧速率的可视化或动画时，Vue每秒处理10帧，而
>React每秒只有1帧。这是因为在开发环境中React需要检查大量的不变量，这是用来提示一些重要的错误或警告用的。
>当然在Vue中也是同意这是很重要的，但是当执行这些检查时，我们对性能保持密切关注。

##### HTML & CSS    
>在React中，所有的东西是javascript，虽然听起来很简单且高雅但是当你向下挖掘时，在javascript中写HTML和CSS，
>当解决问题时，会很痛苦。而在Vue中，我们信奉web的技术并将它们，将css写在html顶部。
####### JSX vs Templates    
在React中，所有的组件在JSX中来表示他们的UI，下面是个例子:

```
render () {
  let { items } = this.props
  let children
  if (items.length > 0) {
    children = (
      <ul>
        {items.map(item =>
          <li key={item.id}>{item.name}</li>
        )}
      </ul>
    )
  } else {
    children = <p>No items found.</p>
  }
  return (
    <div className='list-container'>
      {children}
    </div>
  )
}
```
>JSX有以下优点：
>- 使用编程语言（js）构建你的视图。
>- 在某些方式下，对JSX的工具支持比vue的模板更先进。
>在Vue中，我们有`render functions`甚至还有支持`jsx`。


### HTML & CSS    
>在Vue中，有渲染器函数并且支持`jsx`,默认情况下，我们提供模板作为选择方案:

```
<template>
  <div class="list-container">
    <ul v-if="items.length">
      <li v-for="item in items">
        {{ item.name }}
      </li>
    </ul>
    <p v-else>No items found.</p>
  </div>
</template>
```
>它的优势：
>- 模板中有少量的实现并且代码风格优雅
>- 模板一直是称述性质的
>- 任何有效的HTML在模板中也是有效的
>- 读起来很像英语
>- 不需要再高版本的javascript中增加可读性。
>另外一个好处就是你可以使用预处理器处理`HTML-compliant`模板，比如Pug书写你的Vue模板:

```
div.list-container
  ul(v-if="items.length")
    li(v-for="item in items") {{ item.name }}
  p(v-else) No items found.
```
>**Component-Scoped CSS（组件范围的CSS）**
>除非你的组件分布在多个文件中（比如CSS Modules），范围性的CSS在React中通常是在js中。而在
>Vue中，你完全可以在单个文件中访问到CSS：

```
<style scoped>
  @media (min-width: 250px) {
    .list-container:hover {
      background: orange;
    }
  }
</style>
```
>`scoped`属性自动的对组件范围内的元素通过添加一个唯一的属性来编译。

### 规模    
>React社区在状态管理上引入了`flux/redux`,状态管理方式可以在Vue很容易的集成进来。但是尽管
>如此，React的生态圈还是要比Vue丰富。Vue提供了一个十分简单生成Vue项目的[命令行工具](https://github.com/vuejs/vue-cli)。


### Scaling Down    
>React的学习曲线比较陡峭，在你学习之前你需要了解JSX以及ES2015.Vue中可以简单的通过在html引入vue库
>来使用vue，React也行啊！！！

```
<script src="https://unpkg.com/vue/dist/vue.js"></script>
```

### Native Rendering    
>React Native可以已React组件的形式写原生的IOS、Android程序，在这方面，Vue已经与[Weex](https://alibaba.github.io/weex/)合作了。
>Weex是由阿里巴巴开发的一个跨平台UI框架，这意味着使用Weex，你可以以Vue的组件语法规则开发出的程序可以在浏览器，IOS，Android运行。
>额，这点我承认确实比react-native强悍啊。。。。，当然Weex正在活跃的开发，和react-native一样不成熟。但是Vue和Weex合作开发啊，选择
>React社区还是选择Vue社区呢？如果Weex和Vue成熟稳定的话选择Vue生态圈我觉得还是不错的。


### [FLIP](https://aerotwist.com/blog/flip-your-animations/)
