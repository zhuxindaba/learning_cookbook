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

```
class CompositeComponent {
  constructor(element) {
    this.currentElement = element;
    this.renderedComponent = null;
    this.publicInstance = null;
  }

  getPublicInstance() {
    return this.publicInstance;
  }

  mount() {
    var element = this.currentElement;
    var type = element.type;
    var props = element.props;

    var publicInstance;
    if(isClass(type)) {
      publicInstance = new type(props);
      publicInstance.props = props;
      if(publicInstance.componentWillMount) {
        publicInstance.componentWillMount();
      }
      //如果是复合组件的话，需要走render方法得到渲染的结果
      renderedElement = publicInstance.render();
    }else if(typeof type === 'function') {
      publicInstance = null;
      renderedElement = type(props);
    }

    this.publicInstance = publicInstance;

    var renderedComponent = instantiateComponent(renderedElement);
    this.renderedComponent = renderedComponent;
    return renderedComponent.mount();
  }
}
```
>这个实现保存了一些信息可以在更新期间使用到,比如`this.currentElement`,`this.renderedComponent`,
>`this.publicInstance`.注意复合组件的内部实例和用户提供的`element.type`的实例是不同的。
>`CompositeComponent`是协调器的一种实现，它是不会暴露给使用者的。我们从`element.type`种读取用户自定义类,
>`CompositeComponent`创建它的实例，为了避免困惑，我们调用`CompositeComponent`和`DOMComponent`的中实例的内部实例。
>他们存在，我们将长期活跃的数据与他们联系在一起。
>相比之下，我们调用用户自定义类的一个"公共实例"的实例。公共实例就是自定义组件中render方法以及其他方法中的this。
>`DOMComponent`的实现:

```
class DOMComponent {

  constructor(element) {
    this.currentElement = element;
    this.renderedChildren = [];
    this.node = null;
  }

  getPublicInstance() {
    return this.node;
  }

  mount() {
    var element = this.element;
    var type = element.type;
    var props = element.props;
    var children = props.children || [];
    if(!Array.isArray(children)) {
      children = [children];
    }

    var node = document.createElement(type);
    this.node = node;
    Object.keys(props).forEach(propName => {
      if(propName !== 'children') {
        node.setAttribute(propName, props[propName]);
      }
    });
  }

}
```
