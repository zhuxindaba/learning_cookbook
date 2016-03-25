###react-router的学习体会
* * *
####react-router简单介绍
1.	用react-router可以不用我们用window.addEventListener('hashchanged', fn)去监听当hash值改变了,UI如何渲染.  
2.	react-router的router内部原理会把你的<Route>元素的层级结构转换为一个route config JSX语法大概是这个样子的:  
```
ReactDOM.render((
	<Router history={hashHistory}>
		<Route path="/" component={YouComponent_1}>
			<IndexRoute component={YouComponent_2} />
			<Route path="index" component={YouComponent_3}/>
			<Route path="about" component={YouComponent_4}/>
		</Route>	
	</Router>
), document.body)
```
3.	如果你不喜欢这种写法也可以简单的对象代替它,大概是这个样子  
```
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
```
4.	我们可以通过react-router的this.props.location.query.paramName得到url中传的参数值
* * *
####Route Configuration介绍
1.	这个配置文件告诉router如何去匹配url，当匹配url的时候运行什么代码  
```
class App extends React.Component {
	render() {
		return(
			<div>
				<h1>App</h1>
				<ul>
					<li><Link to="/about">About</Link></li>
					<li><Link to="/index">Index</Link></li>
				</ul>
				{this.props.children}
			</div>
		);
	}
}
class DefaultPage extends React.Component {
	
	render() {
		return(
			<div>
				<h1>This is default Page!</h1>
			</div>
		);
	}
}
ReactDOM.render((
	<Router history={hashHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={DefaultPage}/>
			<Route path="index" component={Index}/>
			<Route path="about" component={About}>
				<Route path="message/:id" component={Message} />
			</Route>
		</Route>	
	</Router>
), document.body)
```
2.	根据这个配置,程序渲染是这样的 url="/"的时候执行App模块,url="/indx"的时候执行Indx模块,url="/about"的时候执行About模块  
url="/about/message/:id"的时候执行Message模块  
3.	当我们想在当url="/"时渲染一个模块,可以用<IndexRoute component={xxx} />来指定一个默认页,这App组件的render()方法中  
的{this.props.childern}就是<DefaultPage>组件
4.	路由优先级,routing的算法规则是按照route的定义顺序执行的,所以当你有两个相同的path时，会路由到你先定义的模块去
