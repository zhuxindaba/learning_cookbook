#bindActionCreators(actionCreators, dispatch)

**使用场景**   

	需要把action creator往下传到一个组件上，却不想让这个组建觉察到Redux的存在，而且不希望把Redux store
	或dispatch传给它
	
</br>
**参数**    

1. `actionCreators`(Fuction Or Object):一个action creator，或者键值是action creators的对象    

2. `dispatch`(Function):一个dispatch函数，由`store`实例提供	  

**返回值**    

	*(Function or Object)*:一个与原对象类似的对象，只不过这个对象中的每个函数值都可以直接dispatch
	action。如果传入的是一个函数，返回的也是一个函数。
	
</br>

**示例**    

`TodoActionCreationCreator.js`    

```
	export function addTodo(text) {
		return {
			type: 'ADD_TODO',
			text
		}
	}
	
	export function removeTodo(id) {
		return {
			type: 'REMOVE_TODO',
			id
		}
	}
```
</br>
`SomeComponent.js`   

```
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as TodoActionCreators from './TodoActionCreators';

class TodoListContainer extends React.Component {

	componentDidMount() {
		//由react-redux注入
		let { dispatch } = this.props;
		
		let action = TodoActionCreators.addTodo('Use Redux');
		dispatch(action);
	}
	
	render() {
		
		let { todos, dispatch } = this.props;
		
		//应用bindActionCreator
		let boundActionCreators = bindActionCreators(TodoActionCreators, dispatch);
		
		return (
			<TodoList todos={todos} 
				{...boundActionCreators}
			/>
		);
		
		//一种可以替换bindActionCreators的做法是直接把dispatch函数和action creators当作props传递给组件
		//return <TodoList todos={todos} dispatch={dispatch} />
	}
}

export default connect(state => ({todos: state.todos}))(TodoListContainer);
```
