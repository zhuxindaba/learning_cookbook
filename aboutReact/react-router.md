###react-router的学习体会
1.	用react-router可以不用我们用window.addEventListener('hashchanged', fn)去监听当hash值改变了,UI如何渲染.  
2.	react-router的router内部原理会把你的<Route>元素的层级结构转换为一个route config JSX语法大概是这个样子的:  
`
ReactDOM.render((
	<Router history={hashHistory}>
		<Route path="/" component={YouComponent_1}>
			<IndexRoute component={YouComponent_2} />
			<Route path="index" component={YouComponent_3}/>
			<Route path="about" component={YouComponent_4}/>
		</Route>	
	</Router>
), document.body)
`
3.	如果你不喜欢这种写法也可以简单的对象代替它,大概是这个样子  
`
	const routes = {
		path: '/',
		component: App,
		indexRoute: {component: Home},
		childRoutes: [
			{ path: 'about', component: About },
			{ path: 'index', component: Index }
		]
	};
	
	ReactDOM.render(
		<Router history={hashHistory} routes={routes}/>,
		document.body
	);
`
4.	我们可以通过react-router的this.props.location.query.paramName得到url中传的参数值
