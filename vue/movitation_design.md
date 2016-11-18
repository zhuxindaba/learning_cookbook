---
title: 了解Vue
categories:
- Vue
---
### 介绍     
>vue是一个用来构建交互式web界面的库。它的核心集中于视图层，它很容易与其他库或现有的项目集成。
>另一方面，Vue完全有能力服务员复杂的单页面应用。但是Vue和其它的框架有什么不同呢？

### 和其它框架的比较    


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
