#applyMiddleware(...middlewares)

	使用包含自定义功能的middleware来扩展Redux是一种推荐方式。Middleware可以让你包装store的dispatch方法来达到你想要的目的。
	同事，middleware还拥有“可组合”这一关键特性。多个middleware可以被组合到一起使用，徐北广场middleware链。其中每个middleward
	都不需要关心链中它前后的middleware的任何信息
	
	例如redux-thunk支持dispatch function，以此让action creator控制反转。被dispatch的function会接收dispatch作为参数，并且可以
	异步调用它们。这类的function就称为thunk
	
	Middleware并不需要和`createStore`绑在一起使用。
	
**参数**    

- 	...middlewares(arguments):    

	遵循Redux middlewareAPI的函数。每个middleware接收`store`的dispatch和getState函数作为命名参数，并返回一个函数    
	该函数会被传入称为`next`的下一个middleware的dispatch方法,并返回一个接收action的新函数，这个函数可以直接调用next(action),
	或者在其他需要的时刻调用。调用链中最后一个middleware会接收真实的store的`dispatch`方法作为`next`参数，并结束调用链
	
**返回值**    

	(Function)一个应用了middleware后的store enhancer。这个store enhancer就是一个函数，并且需要应用到createStore。它会
	返回一个应用了middleware的新的`createStore`
	
**Example：自定义Logger Middleware**    

```
	import { createStore, applyMiddleware } from 'redux';
	import todos from './reducers';
	
	function logger({getState}) {
		return (next) => (action) => {
			console.log('will dispatch', action);
			
			//调用middleware链中下一个middleware的dispatch
			let returnValue = next(action);
			
			console.log('state after dispatch', getState());
			
			return returnValue;
		}
	}
	
	let createStoreWithMiddleware = applyMiddleware(logger)(createStore);
	let store = createStoreWithMiddleware(todos, ['use redux']);
	
	store.dispatch({type: 'ADD_TODO', text: 'understand the middleware'})
	
	/*
	控制台打印
	will dispatch:{type: 'ADD_TODO', text: 'use redux'}
	state after dispatch['use redux', 'understand the middleware'] 
	*/
```
</br>
**Example：使用Thunk Middleware来做异步Action**
```
	import { createStore, combineReducers, applyMiddleware } from 'redux';
	import thunk from 'redux-thunk';
	import * as reducers from './reducers';
	
	//调用applyMiddleware,使用middleware增强createStore
	let createStoreWithMiddleware = applyMiddleware(thunk)(store);
	
	let reducer = combineReducers(reducers);
	//像原生createStore一样使用
	let store = createStoreWithMiddleware(reducer);
	
	function fetchSecretSauce() {
	}	return fetch('http:xx.xx.xx/xx/xx');
	
	//普通的action creator，它们返回的action不需要middleware就能被dispatch
	//但是，它们只表达【事实】，并不表达【异步数据流】
	function makeASandwich(forPerson, secretSauce) {
		return {
			type: 'MAKE_SANDWICH',
			forPerson,
			secretSauce
		}
	}
	
	function apologize(fromPerson, toPerson, error) {
		return {
			type: 'APOLOGIZE',
			fromPerson,
			toPerson,
			error
		}
	}
	
	function withdrawMoney(amount) {
		return {
			type: 'WITHDRAW',
			amount
		}
	}
	
	//即使不使用middleware，也可以dispatch action：
	store.dispatch(withdrawMoney(100))
	
	//如何处理异步action？如：API调用，或者路由跳转
	//用thunk：它是一个返回函数的函数
	
	function makeASandWichSecretSauce(forPerson) {
	
		//控制反转！返回一个接收`dispatch`的函数
		//Thunk middleware知道如何把异步 thunk action 转为普通action
		return function (dispatch) {
			return fetchSecretSauce().then(
				sauce => dispatch(makeASandwich(forPerson, sauce)),
				error => dispatch(apologize('The Sandwich Shop', forPerson, error))
			)
		}
	}
	
	//Thunk middleware可以让我们像dispatch普通action一样dispatch异步的thunk action
	store.dispatch(makeASandWichSecretSauce('Me'));
```

	
