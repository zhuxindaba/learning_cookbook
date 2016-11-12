---
title: 实现说明
categories:
- React
---
### 实现说明    
>这一节主要是对堆栈协调器的实现说明,对React的API有一个技术性的理解，以及React是如何将
>它分为core,renders,reconciler是很重要的，如果你对React的代码库不是很熟悉，请阅读React
>代码库的概览。stack reconciler(堆栈协调器)供应所有React的生产代码。它位于`src/renders/shared/stack/reconciler`目录下
>并且ReactDOM和ReactNative都使用它。

### 概述    
>协调器没有一个公共的API，ReactDOM和ReactNative的渲染器有效的使用它有效的更新用户接口，这些接口是用户编写的用户组件。
>**以递归的过程镶嵌**
>你第一次镶嵌一个组件时:

```
ReactDOM.render(<App />, rootEl);
```
>ReactDOM会顺着reconciler(协调器)传递`<App />`,自助`<App />`是一个React元素，下面的是一个渲染什么的描述，你可以认为它是
>一个简单的对象：

```
console.log(<App />);
// { type: App, props: {} }
```
>协调器会检查`<App/>`是一个class还是一个函数，如果App是一个函数，协调器会调用`App(props)`来获取要渲染的元素。
>如果App是一个类，协调器会用`new App(props)`实例化这个App，调用`componentWillMount()`生命周期方法，然后调用`render()`方法
>来获取渲染的元素.
>无论哪种方式，协调器会知道App要渲染的元素。这个过程是递归的，App有可能渲染到`<Greeting />`, Greeting可能渲染到`<Button / >`等等,
>协调器会递归的通过用户定义的组件向下挖去，知道它知道每一个组件会渲染成什么。你可以假设这个过程的伪代码：

```
function isClass(type) {
  //React.Component的子类都有这个标记
  return (Boolean(type.prototype) && Boolean(type.prototype.isReactComponet));
}

//这个函数接受一个React元素，比如(<App/>)
//返回一个表示为镶嵌的树的DOM或原生节点
function mount(element) {
  var type = element.type;
  var props = element.props;
  //我们需要查明/确定渲染的元素，将type作为函数运行或者创建一个实例并调用render
  var renderedElement;
  if(isClass(type)) {
    //组件类
    var publicInstance = new type(props);
    //设置属性
    publicInstance.props = props;
    //如果有必要则调用生命周期
    if(publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    //通过调用render()得到渲染的元素
    renderedElement = publicInstance.render();
  }else{
    //组件函数
    renderedElement = type(props);
  }

  //这个过程是递归的因为一个组件返回的元素有可能是一个别的类型的组件
  return mount(renderedElement);
  //注意：这个实现是没有完成的而且会无限循环，它只会处理类似<App />,<Button>的元素
  //它还没有支持处理像<div />或<p/>
}

var rootEl = document.getElementById('root');
var node = mount(<App />);
rootEl.appendChild(node);
```
>注意：这仅仅是一段伪代码，它不是真正的实现，它会导致栈溢出，因为我们没有讨论终止递归的条件。
>我们回顾一下上面例子的几个关键概念：
>- React元素是一些简单的对象来代表组件类型和属性(比如`<App/>`)。
>- 用户自定义的组件（比如`<App />`）可以是一个类也可以是一个函数但是他们最终都会被渲染为元素。
>- "mounting"是一个递归的过程它用来创建DOM以及Native树，给React的顶级元素（比如`<App>`）.

### Mounting Host Elements(镶嵌主机元素)    
>如果我们最终不向屏幕渲染任何东西这个过程将毫无作用，除了用户自定义的组件，React元素也可以表示特定
>平台的组件.比如，`Button`可能在render方法中会返回一个`<div />`。如果一个元素的类型是字符串，这样处理
>主机元素：

```
console.log(<div />);
// { type: 'div', props: {} }
```
>没有用户定义与主机元素相联系的代码。
>当协调器遇到一个主机元素时，协调器会让render小心的镶嵌它，比如，ReactDOM会创建一个DOM节点，如果这个主机元素
>有子节点，协调器会按照上面的算法递归的镶嵌，子元素是否是主机元素都没有关系（`<div><hr></div>`），复杂的组件（`<div><Button/></div>`）
>子组件生产出来的DOM节点将会追加到父DOM节点，递归的方式，组装为完整的DOM结构。
>注意：协调器本身不依赖于DOM，完整的镶嵌过程依赖于render（有时候，在源码中称之为镶嵌快照），最终结果可以是DOM node（React DOM）
>一个字符串(ReactDOM Server)或者是原声的视图(React Native).
>如果我们想扩展去处理主机元素的话，可以这样：

```
function isClass(type) {
  // React.Component子类都有这个标记
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isReactComponent)
  );
}

//这个函数只处理复杂类型的元素
//它只处理类似于<App/>和<Button />这样的，而不是<div/>
function mountComposite(element) {
  var type = element.type;
  var props = element.props;

  var renderedElement;
  if (isClass(type)) {
    //组件类
    var publicInstance = new type(props);
    // 设置属性
    publicInstance.props = props;
    //如果有必要，调用生命周期
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    renderedElement = publicInstance.render();
  } else if (typeof type === 'function') {
    //组件函数
    renderedElement = type(props);
  }

  // This is recursive but we'll eventually reach the bottom of recursion when
  //这是个递归的过程，但是当元素是主机元素时（比如<div/>而不是复杂的组件）我们最终会到达递归的底部
  return mount(renderedElement);
}

//这个函数只处理主机类型元素
//比如，它处理<div/>,<p/>不会出来<App/>
function mountHost(element) {
  var type = element.type;
  var props = element.props;
  var children = props.children || [];
  if (!Array.isArray(children)) {
    children = [children];
  }
  children = children.filter(Boolean);

  //这一块的代码不会再协调器中
  //不同的渲染器可能会初始化不同的节点
  //比如，React Native可能会创建IOS或者Android的视图
  var node = document.createElement(type);
  Object.keys(props).forEach(propName => {
    if (propName !== 'children') {
      node.setAttribute(propName, props[propName]);
    }
  });

  //镶嵌子元素
  children.forEach(childElement => {
    // Children may be host (e.g. <div />) or composite (e.g. <Button />).
    //子元素们可能是主机元素（比如<div/>）或复杂性元素(<Button/>)
    //我们会递归的装载他们
    var childNode = mount(childElement);

    //这行代码也是渲染器特有的
    //不同的渲染器有不同的结果
    node.appendChild(childNode);
  });

  //将DOM节点的装载结果返回
  //这儿递归结束
  return node;
}

function mount(element) {
  var type = element.type;
  if (typeof type === 'function') {
    // User-defined components
    return mountComposite(element);
  } else if (typeof type === 'string') {
    // Platform-specific components
    return mountHost(element);
  }
}

var rootEl = document.getElementById('root');
var node = mount(<App />);
rootEl.appendChild(node);
```
>虽然这也能工作但里协调器的真正实现还有很远的距离，主要是漏掉了对更新的支持。

### 介绍（引入）内部实例    
>React的关键特性是你可以重复渲染任何东西，并且他不会创新创建DOM或重置state：

```
ReactDOM.render(<App />, rootEl);
//会重新使用存在的DOM
ReactDOM.render(<App />, rootEl);
```
>然而，我们上面的实现知识装载初始状态的树，不能对他执行更新操作，因为没有存储一些必要的信息，
>如publicInstance，或DOM节点对应于哪些组件。stack reconciler代码库通过将`mount()`函数和一个方法
>放在一个类上。这种方式有一些缺陷，我们现在正在一相反的方向解决这个问题，重写reconciler正在进行中
>不管怎样，现在它的工作方式就是这样的。
>将`mountHost`和`mountComposite`函数拆分出来的替代方案就是，我们将创建两个类：`DOMComponent`和`CompositeComponent`
>两个类都有一个接收elements的`constructor`，还有一个返回镶嵌了dom节点的`mount()`方法，我们将会使用工厂模式代替类中
>顶级的mount()函数。

```
function instantiateComponent(element) {
  var type = element.type;
  if(typeof type === 'function') {
    //用户定义的组件
    return new CompositeComponent(element);
  }else if(typeof === 'string') {
    //平台组件
    return new DOMComponent(element);
  }
}
```
>首先，让我们思考`CompositeComponent`的实现方式：

```
class CompositeComponent {
  constructor(element) {
    this.currentElement = element;
    this.renderedElement = null;
    this.publicInstance = null;
  }

  getPublicInstance() {
    //对应复杂的组件，暴露出这个类实例
    return this.publicInstance;
  }

  mount() {
    var element = this.currentElement;
    var type = element.type;
    var props = element.props;
    var publicInstance;
    var renderedElement;
    if(isClass(type)) {
      //组件类
      publicInstance = new type(props);
      //设置属性
      publicInstance.props = props;
      //如果有必要，调用生命周期
      if(publicInstance.componentWillMount) {
        publicInstance.componentWillMount();
      }
      renderedElement = publicInstance.render();
    }else if(typeof type === 'function') {
      publicInstance = null;
      renderedElement = type(props);
    }

    //保存公共实例
    this.publicInstance = publicInstance;
    //根据元素实例化子组件的内部实例
    //<div>,<p>将为一个DOM节点
    //<App /> <Button>将为一个复杂组件
    var renderedComponent = instantiateComponent(renderedElement);
    this.renderedComponent = renderedComponent;

    //装载renderd的输出
    return renderedComponent.mount();
  }
}
```
>重构`mountHost()`之后的主要区别是，我们可以保持`this.node`以及`this.renderedChildren`于内部的组件实例相关联。
>我们也可以在未来将它们用于非破坏性的更新。因此，每一个内部实例，复杂的以及主机的，现在指向其孩子内部实例。
>为了帮助构思它，如果一个`<App>`组件函数渲染了一个`<Button>`类组件，并且`Button`类渲染了一个`<div>`，内部实例树
>长得是这个样子的：

```
[object CompositeComponent] {
  currentElement: <App />,
  publicInstance: null,
  rendererComponent: [object CompositeComponent] {
    currentElement: <Button />,
    publicInstance: [object Button],
    renderedComponent: [object DOMComponent] {
      currentElement: <div />,
      node: [object HTMLDivElement],
      renderedChildren: []
    }
  }
}
```
>在DOM中你仅仅能看见`div`,但是内部实例树既包含复杂的内部实例也包含主机的内部实例。
>复杂的内部实例需要被存储：
>- 当前的元素
>- 如果元素类型是个类，public实例
>- 单个的内部实例的渲染结果，它既可以是`DOMComponent`也可以是`CompositeComponent`
>主机内部实例也需要被存储:
>- 当前的元素
>- DOM节点
>- 所有的子内部实例，它们既可以是`DOMComponent`也可以是`CompositeComponent`.
>如果你努力设想在复杂的程序中一个内部实例是什么样的结构，(React DevTools)[https://github.com/facebook/react-devtools]
>可以给你一个近似的结果，主机实例是灰色的，复杂实例是紫色的。
>要完成这个重构，我们要引入一个函数镶嵌完整的树到节点容器。比如`ReactDOM.render()`,它返回一个公共实例：

```
function mountTree(element, containerNode) {
  //创建顶层的内部实例
  var rootComponent = instantiateComponent(element);

  //装载顶层组件到containetr
  var node = rootComponent.mount();
  containerNode.appendChild(node);
  //返回它提供的公共实例
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}

var rootEl = document.getElementById('root');
mountTree(<App />, rootEl);
```

### Unmounting(正在解除挂载)    
>现在我们有内部实例维持他们的字元素与DOM节点，我们可以实现unmounting，d对于一个复杂的组件，unmounting调用生命周期的钩子
>然后递归：

```
class CompositeComponent {

  //....
  unmount() {
    //如果有必要调用生命周期的钩子
    var publicInstance = this.publicInstance;
    if(publicInstance) {
      if(publicInstance.componentWillUnMount) {
        publicInstance.componentWillUnMount();
      }
    }

    //卸载单个渲染的组件
    var renderedComponent = this.renderedComponent;
    renderedComponent.unmount();
  }
}
```
>对于`DOMComponent`,unmounting告诉每一个子元素卸载:

```
class DOMComponent {
  //...

  unmount() {
    //卸载所有children
    var renderedChildren = this.renderedChildren;
    renderedChildren.forEach( child => child.unmount());
  }
}
```
>在实践中，卸载DOM组件也会移除事件监听器并且清楚缓存，在这里跳过这些细节。
>现在我们添加一个新的顶级函数调用`unmountTree(containerNode)`，这和`ReactDOM.unmountComponentAtNode()`很相似：

```
function unmountTree(containerNode) {
  //从DOM节点中读取内部实例
  //(这个还不能工作，我们需要改变mountTree来来储存它)
  var node = containerNode.firstChild;
  var rootComponent = node._internalInstance;

  //卸载这个树并且情况这个container
  rootComponent.unmount();
  containerNode.innerHTML = '';
}
```
>为了使它工作，我们需要从DOM节点中获取内部根实例，我们将会修改`mountTree()`添加`_internalInstance`属性到根DOM节点。
>我们也会告诉`mountTree()`销毁任何存在的树，所以它可以被调用多次：

```
function mountTree(element, containerNode) {
  //销毁任何存在的树
  if(containerNode.firstChild) {
    unmountTree(containerNode);
  }

  //创建顶层内部实例
  var rootComponent = instantiateComponent(element);

  //装载顶层内部实例到container
  var mode = rootComponent.mount();
  containerNode.appendChild(node);

  //保存一个到内部实例的引用
  node._internalInstance = rootComponent;

  //返回它所提供的公共实例
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}
```
>现在，运行`unmountTree()`或者运行`mountTree()`多次，移除旧的树然后运行组件的生命周期方法`componentWillUnmount`.

### Updating    
>在上一节，我们实现了`unmounting`,但是如果每一个属性的变化都会改变unmounted和mounted整个树，这对于React来说没有用，
>协调器的目的是尽可能的保持和重用现有实例：

```
var rootEl = document.getElementById('root');
mountTree(<App />, rootEl);
//这里应返回已存在的DOM
mountTree(<App />, rootEl);
```
>我们将会扩展我们的内部实例建立一个或多个方法，除了`mount()`和`unmount()`，`DOMComponent`和`CompositeComponent`将会
>实现一个新的`receive(nextElement)`方法：

```
class CompositeComponent {
  //...

  receive(nextElement) {
    //...
  }
}

class DOMComponent {
  //...

  receive(nextElement) {
    //...
  }
}
```
>它的职责是根据下一个元素提供的说明做任何有必要的组建更新，这部分通常称之为'虚拟dom差异比较'，尽管真正发生的是内部树的递归然后
>让每个内部实例接收到更新。

### 更新复杂组件(Updating Composite Component)    
>当一个复杂组件接收到一个新的元素时，我们运行`componentWillUpdate()`生命周期钩子。然后我们根据新的属性重新渲染组件，然后得到
>下一个渲染的元素：

```
class CompositeComponent {

  //...

  receive(nextElement) {
    var prevProps = this.currentElement.props;
    var publicInstance = this.publicInstance;
    var prevRenderedComponent = this.renderedComponent;
    var prevRenderedElement = this.renderedElement;

    //修改*自己的*元素
    this.currentElement = nextElement;
    var type = nextElement.type;
    var nextProps = nextElement.props;

    //解决下一次的render()输出的是什么
    var nextRenderedElement;
    if(isClass(type)) {
      //组件类
      //如果有必要调用生命周期
      if(publicInstance.componentWillUpdate) {
        publicInstance.componentWillUpdate(prevProps);
      }
      //修改属性
      publicInstance.props = nextProps;
      //重新渲染
      nextRenderedElement = publicInstance.render();
    }else if(typeof type === 'function') {
      //组件函数
      nextRenderedElement = type(nextProps);
    }
  }
}
```
>接下来，我们可以看一下渲染的元素的类型，如果在最后一次的渲染中`type`没有发生变化，下面的
>组件可以就地更新。例如：如果第一次返回`<Button color='red' />`，第二次返回`<Button color='blue'>`
>我们只需要告诉相关联的内部实例接收下一个元素：

```
//...


//如果渲染的元素的类型没有变化
//复用已存在的组建实例并退出
if(prevRenderedElement.type === nextRenderedElement.type) {
  prevRenderedComponent.receive(nextRenderedElement);
  return;
}
```
>但是，如果下一次渲染的组件类型和上一次渲染的组件类型不同，我们不会修改内部实例，一个`<button>`不会变为
>一个`<input>`：

```
// ...

  //如果我们达到这一点，我们需要卸载先前的
  //装载组件，装载新的，交换他们的节点

  //找到老节点因为它将被替换
  var prevNode = prevRenderedComponent.getHostNode();

  //卸载老child并装载新的child
  prevRenderedComponent.unmount();
  var nextRenderedComponent = instantiateComponent(nextRenderedElement);
  var nextNode = nextRenderedComponent.mount();

  //替换child的引用
  this.renderedComponent = nextRenderedComponent;

  //用新的替换老节点
  //注意：这是渲染器特定的代码并且在理想情况下，因位于CompositeComponent的外面
  prevNode.parentNode.replaceChild(nextNode, prevNode);
}
}
```
>综上所述，当一个复杂的组件接收到一个新的元素时，要么委托去修改内部实例，要么卸载它并在原来
>的位置新建一个。
>这里有另外一种情况，一个组件将会重新装载而不是接收一个元素，当元素的`key`改变时，我们不讨论
>`key`的处理，因为它会增加教程的复杂性。注意：我们需要在内部实例添加一个叫`getHostNode`的方法，
>它可能位于特定平台的节点并取代它的更新过程。它的实现简单明了：

```
class CompositeComponent {
  // ...

  getHostNode() {
    // Ask the rendered component to provide it.
    // This will recursively drill down any composites.
    return this.renderedComponent.getHostNode();
  }
}

class DOMComponent {
  // ...

  getHostNode() {
    return this.node;
  }  
}
```

### 更新主机组件    
>主机组件实现，比如`DOMComponent`已不同的方式更新，当它们接收到新的元素时，他们需要更新基于平台特有的视图,
>在React DOM的情景中，这意味着要更新DOM属性：

```
class DOMComponent {
  //...
  receive(nextElement) {
    var node = this.node;
    var prevElement = this.currentElement;
    var prevProps = prevElement.props;
    var nextProps = nextElement.props;    
    this.currentElement = nextElement;

    // Remove old attributes.
    Object.keys(prevProps).forEach(propName => {
      if (propName !== 'children' && !nextProps.hasOwnProperty(propName)) {
        node.removeAttribute(propName);
      }
    });
    // Set next attributes.
    Object.keys(nextProps).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, nextProps[propName]);
      }
    });

    // ...
}
```
>接着，主机组件需要更新它们的children，和复杂组件不同的是，他们可能包含不止一个child，在下面这个简单的例子中，
>我们使用内部实例数组并遍历它，是更新还是替换内部实例依赖于接收到的`type`是否与他们先前的`type`一致，真正的reconciler
>也会也需要元素的`key`来进行插入还是删除，但是我们省略相关的实现。

```
// ...

    //这是React元素的数组
    var prevChildren = prevProps.children || [];
    if (!Array.isArray(prevChildren)) {
      prevChildren = [prevChildren];
    }
    var nextChildren = nextProps.children || [];
    if (!Array.isArray(nextChildren)) {
      nextChildren = [nextChildren];
    }
    //这是内部实例的数组
    var prevRenderedChildren = this.renderedChildren;
    var nextRenderedChildren = [];

    //当我们遍历children时，我们要添加对这个数组的一些操作
    var operationQueue = [];

    //注意：下面的部分非常简单，他不会处理重新排序，它的存在只是为了说明整体流程，但不具体
    for (var i = 0; i < nextChildren.length; i++) {
      // Try to get an existing internal instance for this child
      var prevChild = prevRenderedChildren[i];

      // If there is no internal instance under this index,
      // a child has been appended to the end. Create a new
      // internal instance, mount it, and use its node.
      if (!prevChild) {
        var nextChild = instantiateComponent(nextChildren[i]);
        var node = nextChild.mount();

        // Record that we need to append a node
        operationQueue.push({type: 'ADD', node});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // We can only update the instance if its element's type matches.
      // For example, <Button size="small" /> can be updated to
      // <Button size="large" /> but not to an <App />.
      var canUpdate = prevChildren[i].type === nextChildren[i].type;

      // If we can't update an existing instance, we have to unmount it
      // and mount a new one instead of it.
      if (!canUpdate) {
        var prevNode = prevChild.node;
        prevChild.unmount();

        var nextChild = instantiateComponent(nextChildren[i]);
        var nextNode = nextChild.mount();

        // Record that we need to swap the nodes
        operationQueue.push({type: 'REPLACE', prevNode, nextNode});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // If we can update an existing internal instance,
      // just let it receive the next element and handle its own update.
      prevChild.receive(nextChildren[i]);
      nextRenderedChildren.push(prevChild);
    }

    // Finally, unmount any children that don't exist:
    for (var j = nextChildren.length; j < prevChildren.length; j++) {
     var prevChild = prevRenderedChildren[j];
     var node = prevChild.node;
     prevChild.unmount();

     // Record that we need to remove the node
     operationQueue.push({type: 'REMOVE', node});
    }

    // Point the list of rendered children to the updated version.
    this.renderedChildren = nextRenderedChildren;

    // ...
```
>最后一步，我们执行DOM操作，真实的reconciler是很复杂的因为它还得处理移动:

```
// Process the operation queue.
  while (operationQueue.length > 0) {
    var operation = operationQueue.shift();
    switch (operation.type) {
    case 'ADD':
      this.node.appendChild(operation.node);
      break;
    case 'REPLACE':
      this.node.replaceChild(operation.nextNode, operation.prevNode);
      break;
    case 'REMOVE':
      this.node.removeChild(operation.node);
      break;
    }
  }
}
}
```
>主机组件更新也是这样。

### 顶级更新    
>现在`CompositeComponent`和`DOMComponent`实现了`receive(nextElement)`方法，当元素类型同最后一次相同时，
>我们可以改变顶层`mountTree()`来使用它:

```
function mountTree(element, containerNode) {
  // Check for an existing tree
  if (containerNode.firstChild) {
    var prevNode = containerNode.firstChild;
    var prevRootComponent = prevNode._internalInstance;
    var prevElement = prevRootComponent.currentElement;

    // If we can, reuse the existing root component
    if (prevElement.type === element.type) {
      prevRootComponent.receive(element);
      return;
    }

    // Otherwise, unmount the existing tree
    unmountTree(containerNode);
  }

  // ...

}
```
>现在调用`mountTree()`两次非破坏性的

```
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// Reuses the existing DOM:
mountTree(<App />, rootEl);
```
>这是React内部工作的基本原理。
