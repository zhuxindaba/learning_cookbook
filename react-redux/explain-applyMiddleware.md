#applyMiddleware(...middlewares)

	使用包含自定义功能的middleware来扩展Redux是一种推荐方式。Middleware可以让你包装store的dispatch方法来达到你想要的目的。
	同事，middleware还拥有“可组合”这一关键特性。多个middleware可以被组合到一起使用，徐北广场middleware链。其中每个middleward
	都不需要关心链中它前后的middleware的任何信息
	
	例如redux-thunk支持dispatch function，以此让action creator控制反转。被dispatch的function会接收dispatch作为参数，并且可以
	异步调用它们。这类的function就称为thunk
	
	Middleware并不需要和`createStore`绑在一起使用。
	
**参数**    

- 	...middlewares(arguments):遵循Redux middlewareAPI的函数。每个middleware接收`store`的dispatch和getState函数作为命名参数    
	，并返回一个函数
	
