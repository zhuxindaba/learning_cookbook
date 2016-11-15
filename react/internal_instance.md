---
title: 内部实例的伪实现（思考）
categories:
- React
---
>为什么需要内部实例呢?
>React的主要特性是你可以重新渲染任何东西，并且你不会重复创建DOM以及重置state.

```
ReactDOM.render(<App />, rootEl);
//下面这一行会重新使用已存在的DOM
ReactDOM.render(<App />, rootEl);
```
>当组件需要更新时，如何存储必要的信息呢？比如说`publicInstances`,DOM元素与组件之间的关系。
>堆栈协调器代码库通过在类中加了一个`mount()`函数解决这个问题，这种方式有点缺点，正在改进。
>把`mountHost()`和`mountComposite()`分离出来的替代方案是创建了两个类`DOMComponent`和`CompositeComponent`
>这两个类都有一个接收`element`的构造函数，当然还有一个`mount()`方法返回已镶嵌的节点，用一个工厂方法实例化正确的
>class来替代顶级`mount()`方法。

```
function instantiateComponent(element) {
  var type = element.type;
  if(typeof type === 'function') {
    return new CompositeComponent(type);
  }else if(typeof type === 'string') {
    return new DOMComponent(type);
  }
}
```
>CompositeComponent(复杂组件)的实现:
