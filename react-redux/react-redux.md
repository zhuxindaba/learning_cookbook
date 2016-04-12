###为什么要用react-redux?
在单页应用中,服务器的相应,UI状态,缓存数据,被选中的标签,是否加载动画效果等等这些都可以理解为state,当应用变得庞大复杂时,    
传统的javascript代码处理这些状态 ,只会让维护变得更加困难,而用redux的原因就是将应用程序中的state的变化变得可预测
***

###redux的三大原则
1. 单一的store,整个应用的state存放在一个object tree中,并且这个store是唯一的
<br>	
2. state是只读的,唯一改变state的方法就是触发action,action就是一个描述你要干什么的js对象    
```
	var actionName = { 
						type: typeName,//必须为type表示你将要执行什么动作,
						desc: ''	//自己定义，你将希望通过这个动作告知其余组建通过这个动作发生的事
					}
```
<br>
3. 使用reducer修改state,reducer是一个纯函数,它接收的参数为先前的state和将要执行的action,并返回新的state
***

###Action
Action是把数据从应用中传到store的有效载荷,它是store数据的唯一来源,一般通过`store.dispatch( {type: 'xx', desc: 'xx'} )`将action传到store
     
###ActionCreator
ActionCreator就是生成action对象的函数,返回一个action对象
```
	function addTodo(text) {
		return {
			type: 'ADD_TODO',
			text
		}
	}
```
<br>
在store里调用action创建函数: `store.dispatch(addTodo('learn redux'))`   
在React组建中如何调用呢？需要用到react-redux中提供的connect()(ComponentName)将dispatch函数注入到组建的props中然后通过    
`this.props.dispatch(addTodo(text))`调用    
bindActionCreators()待定
***

###Reducer
Action只是描述了事件发生了而已,但是并没有指明应用如何更新state,而更新state正是reducer做的事情。    
######设计state的结构
在redux应用中,所有的state都被保存在一个单一对象中。reducer就是一个函数,接收旧的state和action,返回新的state.    
不要在reducer里做以下操作:    
1. 修改传入参数
2. 执行有副作用的操作,如API请求和路由跳转
3. 调用非纯函数,如Date.norw()或Math.random()    
每个reducer只负责全局state中它负责的一部分。每个reducer的state参数都不同，分别对应它管理的那部分的state数据     
combineReducers()所做的只是生成一个函数,这个函数来调用你的一系列reducer，每个reducer根据它们的key来筛选出state中    
的一部分数据并处理,然后这个生成函数将所有reducer的结果合并成一个大的对象。
***

###Store
action用来描述发生了什么，使用reducer根据action更新state，Store就是将它们联系到一起的对象,Store的职责:    
1. 维持应用程序的state
<br>
2. 提供getState()获取state
<br>
3. 提供dispatch(action)方法更新state
<br>     
4. 提供subscribe(listener)注册监听器
Redux应用中只有唯一的一个store,通过redux的createStore(reducers, initialState)创建store    
createStore()的第二个参数用来设置初始状态    
***

###数据流
严格的单项数据流是redux架构的设计核心,Redux应用中数据的生命周期遵循下面4个步骤:   
1. 调用store.dispatch(action),你可以在任何地方调用store.dispatch(action),组件中，定时器中
<br>    
2. Redux store调用传入的reducer函数.  
Store会把连个参数传入reducer：当前的state树和action。reducer是一个纯函数。它仅仅用于计算下一个state。它应该是完全    
可以预测的：    多次传入相同的输入必须产生相同的输出。它不应该做有副作用的操作，如API调用或路由跳转。    
这些应该在dispatch action前发生
<br>   
3. 根reducer应该用combineReducers()把多个reducer输出合并成单一的一个state树
```
	function todos(state=[], action) {
		//...
		return nextState;
	}
	
	function visibleTodoFilter(state='SHOW_ALL', action) {
		//...
		return nextState;
	}
	
	const reducers = combineReducers({
		todos,
		visibleTodoFilter
	});
```
<br>
当你触发action后，combineReducers返回的reducers会负责调用两个reducer,然后把两个结果集合并成一个state树:    
```
	return{
		todos: nextTodos,
		visibleTodoFilter: nextVisibleTodoFilter
	}
```
<br>
4. 	Redux Store保存了根reducer返回的完整的state树，这个新的树就是应用的下一个state!所有调用store.subscribe(listener)   
的监听器都将被调用;监听器里可以调用`store.getState()`获取当前的state   
现在，可以应用新的state来更新UI，在组建中的componentDidMount生命周期中调用`this.setState()`来更新
***

###搭配React
Redux和React之间没有关系。Redux支持React、Angular、jQuery甚至纯javascript    
1. Redux的React绑定包含了容器组件和展示组件相分离的开发思想，明智的做法就是只在最顶层组件（路由操作）    
里使用Redux。其余内部组件仅仅是展示性的，所有数据都通过props传入
<br>
2. 连接到Redux，通过react-redux提供的connect()方法将包装好的组件连接到redux。      
任何一个




