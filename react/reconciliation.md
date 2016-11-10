---
title: React Reconciler Algorithm
categories:
- React
---
### Reconciliation(协调器)    
>React提供了一个声明式的API，所以你不用担心在每次更新时到底发生了什么变化，这使得写代码变得简单了许多
>但是React是如何实现的对我们来说是透明的不明显的。这篇文章阐述了React的'diffing'算法所做的选择，因此
>组件的更新是可预见的并且是高性能的。

### Motivation(动机)    
>当你使用React时，你可以认为在一个单一的时间点render()函数创建了一个React元素的树，当下一个props或state
>更新时，render()函数将会得到一个新的不同的React元素的树，React需要解决如何高效的更新UI以匹配最新的树。
>一些通用方案有性能问题，时间复杂度会为(O(n3))如果在React使用这些通用方案的话，100个元素将会进行一百万次
>的比较,话费太昂贵了，替代方案是，React实现了一种基于以下两种假设的时间复杂度为O(n)的算法:
>1. 两种不同类型的元素将会产出不同的树。
>2. 开发人员可以暗示在render时维持一个稳定的key属性。
> 在实践中，这些假设在实际使用的情况下都有效。

### The Diffing Algorithm(Diff算法)    
>当比较两个树时，React首先会比较两者的根元素，该行为取决于根元素的类型。
>**不同类型的元素**
>每当根元素有不同类型时，React将会销毁该树并且重新构建新的树，从`<a>`到`<img>`,`<Article>`到`Coment`,
>从`<Button>`到`<div>`都会进行全新的重新构建过程。当拆卸一个树时，旧的DOM节点会被销毁，组件实例收到`componentWillUnmount()`
>当构建新树的时候，新的DOM节点将会被插入到DOM中，组件实例会收到`componentWillMount()`接着会`componentDidMount()`
>任何和旧树相关的状态都会丢失.任何在root节点之下的组件以及他们的state都会被销毁，比如：

```
<div>
  <Counter />
</div>

<span>
  <Counter />
</span>
```
>这将会销毁`<Counter>`并重新镶嵌一个新的`<Counter>`.

### 相同类型的DOM元素    
>当比较两个相同类型的DOM元素时，React会查看两个组件的属性，保持相同的DOM节点，只会更新改变的属性，例如：

```
<div className="before" title="stuff" />

<div className="after" title="stuff" />
```
>当比较这两个DOM元素时，React知道只修改基础DOM节点的类名。当更新`style`时，React同样知道只改变的变化了的属性
>例如：

```
<div style={{color: 'red', fontWeight: 'bold'}} />

<div style={{color: 'green', fontWeight: 'bold'}} />
```
>当在两个元素之间转换时，React知道仅修改`color`样式。不会去修改`fontWeight`样式。处理完DOM节点之后，React会递归操作
>子节点。

### 相同类型的组件节点    
>当一个组件更新时，该实例保持不变，所以在render时state是被维护的，React修改基础组件实例的属性，以匹配新的元素，然后调用
>基础组件实例的`componentWillReceiveProps()`和`componentWillUpdate()`。
>接下来，`render()`方法被调用，然后diff算法(diff algorithm)递归上次的结果和最新的结果.

### 子组件的递归    
>默认情况下，当递归一个DOM节点的子节点时，React在同一时间仅仅是迭代子组件们的列表并且每当有差异的时候会生成一个突变。
>例如:当在子组件的最后添加一个新的元素时，这两个树的之间的转变，工作的很好。

```
<ul>
  <li>first</li>
  <li>second</li>
</ul>

<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li>
</ul>
```
>React将匹配两个`<li>first</li>`树，匹配`<li>second</li>`树，然后去插入`<li>third</li>`树。
>如果你天真的实现，当插入在最开始的位置，那么会有很糟糕的性能问题。比如，以下的这两课树之间的转换很差：

```
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
```
>React将会改变每一个子节点而不是实现它，它可以保持`<li>Duke</li>`和`<li>Villanova</li>`的子节点的完整性，
>这种低效性是一个问题.

### Keys    
>为了解决这一个问题，React支持了一个key的属性，当子组件有key属性时，React使用这个key，来匹配原始树的子节点与
>随后的树中的子节点，通过添加key使树的转换更加高效。

```
<ul>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>

<ul>
  <li key="2014">Connecticut</li>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
```
>现在React知道持有'2014'的key是新的节点，而持有`2015`和`2016`的节点仅仅移动就可以了，在实践中，发现一个key并不是
>很难，你将要陈列的元素也许已经有一个唯一的id了，所以这个key值来源于你的data：

```
<li key={item.id}>{item.name}</li>
```
>当不是这种场景时，你可以添加一个key或生成一个key，这个key只需要和他相邻的节点不同就可以了，不需要全局唯一。
>作为最后的手段，你可以传递数组的下标作为key，如果列表不需要排序这工作的很好，但是重新排序会很慢。

### Tradeoffs(权衡)    
>记住reconciliation算法的实现细节很重要，React可以在每一个动作下重新render整个App，最终结果相同，我们会定期的改善
>使常见的场景更加快速。
>在最近的实现中，你可以表达一个事实，一个子组件已经从它的兄弟节点中移除了，但是你不能告诉它被移到哪里了。算法会重新
>render整个子组件们。
>因为React依赖于启发式算法，如果不能满足它背后的假设，性能会受影响。
>1. 该算法不会视图去匹配不同类型节点的子树，如果你发现两个类型的组件的输出很相似，你可以让他们变为相同的类型，在实践中
>我们还没发现这会成为一个问题。
>2. keys应该是稳定的，可预测的，以及唯一的，不稳定的key（比如:Math.random()）将会引起，组件实例和DOM节点不必要的重新创建，
>从而导致性能退化和状态丢失.
