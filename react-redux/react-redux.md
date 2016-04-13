###为什么要用react-redux?
		在单页应用中,服务器的相应,UI状态,缓存数据,被选中的标签,是否加载动画效果等等这些都可以理解为state,当应用变得庞
		大复杂时传统的javascript代码处理这些状态 ,只会让维护变得更加困难,而用redux的原因就是将应用程序中的state的变化变得
		可预测
***

###redux的三大原则
1. 单一的store,整个应用的state存放在一个object tree中,并且这个store是唯一的
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
3.调用非纯函数,如Date.norw()或Math.random()       
		每个reducer只负责全局state中它负责的一部分。每个reducer的state参数都不同，分别对应它管理的那部分的state数据     
		combineReducers()所做的只是生成一个函数,这个函数来调用你的一系列reducer，每个reducer根据它们的key来
		筛选出state中的一部分数据并处理,然后这个生成函数将所有reducer的结果合并成一个大的对象。
***

###Store
action用来描述发生了什么，使用reducer根据action更新state，Store就是将它们联系到一起的对象,Store的职责:    
1. 维持应用程序的state    
2. 提供getState()获取state    
3. 提供dispatch(action)方法更新state    
4. 提供subscribe(listener)注册监听器    
Redux应用中只有唯一的一个store,通过redux的createStore(reducers, initialState)创建store    
createStore()的第二个参数用来设置初始状态    
***

###数据流
严格的单项数据流是redux架构的设计核心,Redux应用中数据的生命周期遵循下面4个步骤:   
1. 调用store.dispatch(action),你可以在任何地方调用store.dispatch(action),组件中，定时器中    
2. Redux store调用传入的reducer函数.      
		Store会把连个参数传入reducer：当前的state树和action。reducer是一个纯函数。它仅仅用于计算下一个state。它应该是完全    
		可以预测的：    多次传入相同的输入必须产生相同的输出。它不应该做有副作用的操作，如API调用或路由跳转。    
		这些应该在dispatch action前发生    
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
2. 连接到Redux，**通过react-redux提供的connect()方法将包装好的组件连接到redux**。     
		**任何一个从connect()包装好的组件都可以得到一个dispatch方法作为组件的props，以及得到全局state中所需的内容**
		connect()的唯一参数是selector。此方法可以从Redux store中接收到全局state，然后返回组件中需要的props
```
	class App extends React.Component {
		render() {
			return(
				//...
			);
		}
	}
	
	//基于全局state，哪些是我们想要注入props的
	//https://github.com/reactjs/reselect这个待研究，用这个注入效果更好?
	function select(state) {
		return {
			xxx: state.xxx
		}
	}
	
	//包装component
	export default connect(select)(App);
```
***

###异步Action
		前面所述的是同步action,每当dispatch action时,state会理解被更新。那么Redux如何操作异步数据流?
######Action
当调用异步API时,有两个非常关键的时刻:发起请求的时刻,和接收响应的时刻（也可能是超时）。</br></br>
这两个时刻都可以更改应用的state;为此，你需要dispatch普通的同步action。一般情况下，每个api请求都至少需要dispatch三个不同的action:    

- **一个通知reducer请求开始的action**
</br>     
		对于这种action,reducer可能会切换一下state中的isFeching标记.以此来告诉UI来显示进度条.    
		
- **一个通知reducer请求成功结束的action**
</br>
		对于这种action,reducer可能会把接收到的新数据合并到state中,并重置isFetching。UI则会隐藏进度条，并显示接收到的数据    
		
- **一个通知reducer请求失败的action**
</br>
		对于这种action，reducer可能会重置isFetching.或者，有些reducer会保存这些失败信息,并在UI显示出来.    
		
***
###异步Action Creator
		如何将不同的action creator和网络请求结合起来?使用Redux Thunk这个中间件,通过使用中间件，action creator除了返回action对象
		外还乐意返回函数    
		
		当action creator返回函数时，这个函数会被Redux Thunk middleware执行。这个函数并不需要保持纯净；它可以带有副作用，包括异步执行
		API请求。这个函数还可以dispatch action    
		
```
	//thunk action creator
	//使用方式和同步cation一样	dispatch(fetchPosts('xxx'))
	export function fetchPosts(xxx) {
		//Thunk middleware知道如可处理函数
		//这里把dispatch方法通过参数的形式传给函数，以此来让它自己也能dispatch action
		
		return function(dispatch) {
			
			dispatch(action);
			
			//执行api请求使用isomorphic-fetch库替代XMLHttpRequest
		}
		
	}
```
</br>
		我们如何在dispatch机制中引入Redux Thunk middleware？使用appluMiddleware(),**thunk的一个优点就是它的结果可以再次被dispatch**    
		    
		    
```
	//**index.js代码**
	import thunkMiddleware from 'react-thunk';
	import createLogger from 'redux-logger';
	import { createStore, applyMiddleware } from 'redux';
	
	const createStoreWithMiddleware = applyMiddleware(
		thunkMiddleware,	//允许我们dispatch()函数
		createLogger
	)(createStore);
	
	const reducers = combineReducers({
		//拆分的单个reducer函数
	})
	
	const store = createStoreWithMiddleware(reducers);
```
</br>
```
	//**action.js代码**
	export function fetchPosts(xxx) {
		return (dispatch) => {
			//...
			dispatch(action)
		}
	}
	
	export function fetchPostsIfNeeder(xxx) {
		//可接收getState()方法
		return (fetch, getState) => {
		
		}
	
	} 
```
</br>
***
###异步数据流

如果不使用middleware的话,Redux的store只支持同步数据流。而这也是createStore()所默认提供的创建方式，可以使用applyMiddleware()    
来增强createStore(),使用redux-thunk这样支持异步的middleware都包装了store的dispatch()方法,以此让你dispatch一些除了action以外    
的内容。**当niddleware链中的最后一个middleware dispatch action 时，这个action必须是一个普通对象。**    

###Middleware

**middleware是指可以被嵌入在框架接收请求道产生相应过程之中的代码，它提供的是位于action被发起之后，到达reducer之前的扩展点**    
可以利用Redux middleware来进行日志记录、创建崩溃报告、调用异步接口或者路由等等。        
		
**使用Redux的一个益处就是它让state的变化过程变得可预知和透明。每当一个action发起后，新的state就会被计算保    
存下来。state不能自身修改，只能由特定的action引起变化**    

***
###减少样板代码
- Action的type用常量，可以将所有type放在一个文件中，然后引入    

- Action Creators创建生成action的函数    

- 生产Action Creators写简单的action creator函数，尤其是数量巨大的时候，代码不易于维护，可以写一个用于生成action creator的函数：    
```
	function makeActionCreator(type, ...argNames) {
		return function(...args) {
			let action = { type };
			argNames.forEach(arg, index) {
				action[argNames[index]] = args[index];
			}
			return action;
		}
	}
	
	const ADD_TODO = 'ADD_TODO';
	const EDIT_TODO = 'EDIT_TODO'
	const REMOVE_TODO = 'REMOVE_TODO';
	
	export const addTodo = makeActionCreator(ADD_TODO, 'todo');
	export const editTodo = makeActionCreator(EDIT_TODO, 'id', 'todo');
	export const removeTodo = makeActionCreator(REMOVE_TODO, 'id');
```     

**redux-actions可以帮助生成action creator，这个待研究**    

- 异步Action Creators    

		中间件让你在每个action对象分发出去之前，注入一个自定义的逻辑来解释你的action对象。异步action是中间件
		最常见用例。如果没有中间件，dispatch只能接收一个普通对象。因此我们必须在components里面进行AJAX调用：    
	
`actions.js`
</br>	
```
export function loadPostsSuccess(userId, response) {
  return {
    type: 'LOAD_POSTS_SUCCESS',
    userId,
    response
  };
}

export function loadPostsFailure(userId, error) {
  return {
    type: 'LOAD_POSTS_FAILURE',
    userId,
    error
  };
}

export function loadPostsRequest(userId) {
  return {
    type: 'LOAD_POSTS_REQUEST',
    userId
  };
}
```
</br>

`component.js`
</br>
```
import { Component } from 'react';
import { connect } from 'react-redux';
import { loadPostsRequest, loadPostsSuccess, loadPostsFailure } from './actionCreators';

class Posts extends Component {
  loadData(userId) {
    // 调用 React Redux `connect()` 注入 props ：
    let { dispatch, posts } = this.props;

    if (posts[userId]) {
      // 这里是被缓存的数据！啥也不做。
      return;
    }

    // Reducer 可以通过设置 `isFetching` 反应这个 action
    // 因此让我们显示一个 Spinner 控件。
    dispatch(loadPostsRequest(userId));

    // Reducer 可以通过填写 `users` 反应这些 actions
    fetch(`http://myapi.com/users/${userId}/posts`).then(
      response => dispatch(loadPostsSuccess(userId, response)),
      error => dispatch(loadPostsFailure(userId, error))
    );
  }

  componentDidMount() {
    this.loadData(this.props.userId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userId !== this.props.userId) {
      this.loadData(nextProps.userId);
    }
  }

  render() {
    if (this.props.isLoading) {
      return <p>Loading...</p>;
    }

    let posts = this.props.posts.map(post =>
      <Post post={post} key={post.id} />
    );

    return <div>{posts}</div>;
  }
}

export default connect(state => ({
  posts: state.posts
}))(Posts);

```
</br>

**`redux-thunk`中间件可以把action creators写成`thunks`,也就是返回函数的函数**    

使用react-redux修改上面的代码：   

`actions.js`
</br>
```
export function loadPosts(userId) {
  // 用 thunk 中间件解释：
  return function (dispatch, getState) {
    let { posts } = getState();
    if (posts[userId]) {
      // 这里是数据缓存！啥也不做。
      return;
    }

    dispatch({
      type: 'LOAD_POSTS_REQUEST',
      userId
    });

    // 异步分发原味 action
    fetch(`http://myapi.com/users/${userId}/posts`).then(
      response => dispatch({
        type: 'LOAD_POSTS_SUCCESS',
        userId,
        respone
      }),
      error => dispatch({
        type: 'LOAD_POSTS_FAILURE',
        userId,
        error
      })
    );
  }
}
```
</br>
`component.js`
</br>
```
import { Component } from 'react';
import { connect } from 'react-redux';
import { loadPosts } from './actionCreators';

class Posts extends Component {
  componentDidMount() {
    this.props.dispatch(loadPosts(this.props.userId));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userId !== this.props.userId) {
      this.props.dispatch(loadPosts(nextProps.userId));
    }
  }

  render() {
    if (this.props.isLoading) {
      return <p>Loading...</p>;
    }

    let posts = this.props.posts.map(post =>
      <Post post={post} key={post.id} />
    );

    return <div>{posts}</div>;
  }
}

export default connect(state => ({
  posts: state.posts
}))(Posts);
```
</br>
***
###计算衍生数据
		`Reselect库`可以创建可记忆的可组合的selector函数，Reselect selectors可以高效的计算
		Redux store里的衍生数据    
		
不使用`reselect`当state发生变化，组件更新时，会如果state tree非常大，会带来性能问题		

- **创建可记忆的Selector：**
		只有在我们关注的state发生变化时才重新计算此state，而在其他非相关state的变化不会引起
		此state重新计算。
		Reselect提供的`creatSelector`函数创建可记忆的selector，`createSelector`接收一个input-selectors
		数组和一个转换函数作为参数。如果state tree的改变会引起input-selectors值变化，那么selector会调用
		转换函数，传入input-selectors作为参数，并返回结果，如果input-selectors的值和前一次一样，它将会直接
		返回前一次计算的数据，而不重新调用转换函数    
		
`selectors/TodoSelectors.js`
</br>
```
import { createSelector } from 'reselect';
import { VisibilityFilters } from './actions';

function selectTodos(todos, filter) {
  switch (filter) {
  case VisibilityFilters.SHOW_ALL:
    return todos;
  case VisibilityFilters.SHOW_COMPLETED:
    return todos.filter(todo => todo.completed);
  case VisibilityFilters.SHOW_ACTIVE:
    return todos.filter(todo => !todo.completed);
  }
}

const visibilityFilterSelector = (state) => state.visibilityFilter;
const todosSelector = (state) => state.todos;

export const visibleTodosSelector = createSelector(
  [visibilityFilterSelector, todosSelector],
  (visibilityFilter, todos) => {
    return {
      visibleTodos: selectTodos(todos, visibilityFilter),
      visibilityFilter
    };
  }
);
```
</br>
		在上例中，visibilityFilterSelector 和 todosSelector 是 input-selector。因为他们并不转换数据，
		所以被创建成普通的非记忆的 selector 函数。但是，visibleTodosSelector 是一个可记忆的 selector。
		他接收 visibilityFilterSelector 和 todosSelector 为 input-selector，还有一个转换函数来计算过
		滤的 todos 列表。
		    
- **组合 Selector**
		可记忆的 selector 自身可以作为其它可记忆的 selector 的 input-selector。下面
		的 visibleTodosSelector 被当作另一个 selector 的 input-selector，来进一步通过关键字（keyword）过滤 todos。    
		
```
const keywordSelector = (state) => state.keyword

const keywordFilterSelector = createSelector(
  [ visibleTodosSelector, keywordSelector ],
  (visibleTodos, keyword) => visibleTodos.filter(
    todo => todo.indexOf(keyword) > -1
  )
)
```
</br>
- **连接 Selector 和 Redux Store**
在react-redux中，使用 connect 来连接可记忆的 selector 和 Redux store    

`containers/App.js`
</br>
```
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { addTodo, completeTodo, setVisibilityFilter } from '../actions'
import AddTodo from '../components/AddTodo'
import TodoList from '../components/TodoList'
import Footer from '../components/Footer'
import { visibleTodosSelector } from '../selectors/todoSelectors'

class App extends Component {
  render() {
    // Injected by connect() call:
    const { dispatch, visibleTodos, visibilityFilter } = this.props
    return (
      <div>
        <AddTodo
          onAddClick={text =>
            dispatch(addTodo(text))
          } />
        <TodoList
          todos={this.props.visibleTodos}
          onTodoClick={index =>
            dispatch(completeTodo(index))
          } />
        <Footer
          filter={visibilityFilter}
          onFilterChange={nextFilter =>
            dispatch(setVisibilityFilter(nextFilter))
          } />
      </div>
    )
  }
}

App.propTypes = {
  visibleTodos: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  })),
  visibilityFilter: PropTypes.oneOf([
    'SHOW_ALL',
    'SHOW_COMPLETED',
    'SHOW_ACTIVE'
  ]).isRequired
}

// 把 selector 传递给连接的组件
export default connect(visibleTodosSelector)(App)
```




		




