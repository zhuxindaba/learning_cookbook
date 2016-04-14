#Redux API和词汇解释
###词汇解释
- **State**    

		顶层state为一个对象,键-值集合，尽可能保证state可序列化。
</br>
- **Action**    

		Action是一个用来表示即将改变state的对象。它是将数据放入store的唯一途径。action必须拥有一个`type`域，用来
		指明需要执行的action type
</br>
- **Reducer**    

		Reducer接收两个参数：之前累计运算的结果和当前被累计的值，返回的是一个新的累计结果。在Redux中，累计对的运算
		结果是state对象，而被累计的值是action。Reducer由上次累计的结果state与当前被累积的action计算得到一个新state。
		`Reducer必须是纯函数，不要在Reducer中有副作用操作，比如API调用`
</br>
- **dispatch函数**    

		*dispatch function*是一个接收action或者异步action的函数，该函数要么往store分发一个或多个action，要么不分发
		任何action
</br>
		**一般的dispatch function 和store实例提供的没有middleware的base dispatch function之间的区别：**
		Base dispatch functionzing是同步地把action与上一次从store返回的state发往reducer，然后重新计算出新的state，它
		期望action会是一个可以被reducer消费的普通对象。
		
		`Middleware`封装了base dispatch function，允许dispatch function处理action之外的异步action。middleware封装了
		base dispatch function，允许dispatch function处理action之外的异步action。Middleware可以改变、延迟、忽略action
		或异步action，也可以在传递给下一个middleware之前对它们进行解释
		
</br>
- **Action Creator**   
		Action Creator就是一个创建action的函数，action是一个信息的负载，而action creator是一个创建action的工厂，调用action creator
		只会生成action，但不分发，需要调用store的`dispatch`function才会引起变化，bound action creator，是指一个函数调用action creator并
		立即将结果分发给一个特定的store实例。
		
		如果action creator需要读取当前的state、调用API、或引起诸如路由变化等副作用，那么它应该返回一个异步action而不是action。  

</br>
- **异步Action**    

		异步action是一个发给dispatch函数的值，但是这个值还不能被reducer消费。在发往base dispatch() function之前，middleware会把异步action
		转化成一个或一组action。异步action可以有多种type，这取决于你所使用的middleware，比如thunk，虽然不会立即把数据传递给reducer，但是一旦
		操作完成就会出发action的分发事件。
		
</br>
- **Middleware**    

		Middleware是一个组合dispatch function的高阶函数，返回一个新的dispatch function，通常将异步actions转换成action。
		
		Middleware利用复合函数使其可以组合其他函数，可用于记录action日志、产生其他诸如变化路由的操作用，或将异步的API调用
		变为一组同步的action
			    

</br>
- **Store**    

		Store维持着应用的state tree对象。因为应用的构建发生于reducer，所以一个Redux应用当中应当只有一个store

</br>
- **Store Creator**    

		Store Creator是一个创建Redux store的函数。理解由Redux导出的base store creator与从store enhancer返回的store creator
		之间的区别

</br>
- **Store enhancer**    

		Store enhancer是一个组合store creator的高阶函数，返回一个新的强化过的store creator。这与middleware相似，它允许你通过符合函数
		改变store接口
</br>
***
###API文档
</br>
####顶级暴露的方法
- **createStore(reducer, [initialState])**    

创建一个Redux store来以存放应用中的所有state，应用中有且仅有一个store    

**参数**    

1. reducer(*Function*):接收两个参数，分别是当前的state树和要处理的action，返回新的state树。    

2. [initialState](any):初始时的state，如果你使用combineReducers创建reducer，它必须是一个普通对象，与传入的keys保持同样的结构       

- **combineReducers(reducers)**    

- **applyMiddleware(...middlewares)**    

- **bindActionCreators(actionCreators, dispatch)**    

- **compose(...functions)**待研究    

####Store API
</br>
* **Store**   

  - getState()    
  
  - dispatch(action)    
  
  - subscribe(listener)    
  
  - getReducer()    
  
  - replaceReducer(nextReducer)
