#组件的生命周期说明
* * *

###constructor的说明  

* * *

###componentWillMount(组件即将镶嵌)  
在初始化渲染之前立刻调用,如果在这个方法内调用setState()方法,render()将会感知到更新后的state,将会执行仅一次,尽管state改变了。  
* * *

###componentDidMount(组件已经镶嵌)  
仅调用一次
在组件初始化渲染之后立刻调用一次,在生命周期的这个时间点,组件拥有一个DOM展现,你可以通过ReactDOM.findDOMNode(this)获取整个dom节点
也可以访问dom组件中的ref属性代表的组件,可以在该方法中发送ajax请求
原先的this.getDOMNode()已经被弃用了，
* * *

###componentWillReceiveProps(组件即将接收props)
在组件接收到新的props的时候调用,在初始化渲染的时候,改方法不会调用,用此函数可以作为react在prop传入之后,render()渲染之前更新state的机会。  
老的props可以通过this.props获取到。在该函数中调用this.setState()将不会引起第二次渲染。  
* * *

###shouldComponentUpdate(组件应该被更新)  
在接受到新的props或者state,将要渲染之前调用。该方法在初始化渲染的时候不会调用,在使用forceUpdate方法的时候也不会。如果确定新的props和state  
不会导致组件更新，则此处应该返回false.    
```
	shouldComponentUpdate() {
		return nextProps.id != this.props.id;
	}
```  
如果shouldComponentUpdate返回false,则render()将不会执行,直到下一次state改变(另外componentWillUpdate和componentDidUpdate也不会被调用)  
默认情况下,shouldComponentUpdate总会返回true,使用shouldComponentUpdate可以提升应用的性能  
* * *

###componentWillUpdate(组件即将更新)
在接受到新的props和state之前立刻调用，在初始化渲染的时候该方法不会被调用。使用该方法做一些更新之前的准备工作。  
`注:不能在该方法中使用this.setState()如果需要更新state来相应某个prop的改变请使用componentWillReceiveProps()`
* * *

###componentDidUpdate(组件已经更新)
在组件的更新已经同步到DOM中之后立刻被调用。改方法不会在初始化渲染的时候调用。使用该方法可以在组件更新之后操作DOM元素  
`使用该方法，你仍然可以获取DOM节点`
* * *

###componentWillUnmount(组件将要移除)
在组件从DOM中移除的时候立刻被调用。  
在该方法中执行任何必要的清理，比如无效的定时器，或者清除在componentDidMount中创建的DOM元素
