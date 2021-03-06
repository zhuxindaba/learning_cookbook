###react-router的学习体会
理解route组件该在生命周期中的哪个阶段执行是非常重要的，最常见的事情就是获取数据。router组件的生命周期和react组件的生命周期是一样的
* * *

####Lifecycle hooks when routing
1.	用react-router可以不用我们用window.addEventListener('hashchanged', fn)去监听当hash值改变了,UI如何渲染.  
2.	react-router的router内部原理会把你的<Route>元素的层级结构转换为一个route config JSX语法大概是这个样子的:  
```
ReactDOM.render((
	<Router history={hashHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={Home} />
			<Route path="index/:id" component={Index}/>
			<Route path="about/:id" component={About}/>
		</Route>	
	</Router>
), document.body)
```
-	如果你不喜欢这种写法也可以简单的对象代替它,大概是这个样子  
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
3.生命周期的方法何时执行？   
+	当用户输入'/',App组件的componentDidMount被唤起,Home组件的componentDidMount被唤起,Index,About无  
+	当用户'/index/123',App组件的componentWillReceiveProps,componentDidUpdate被唤起    
Home组件的componentWillUnmount被唤起,Index组件的componentDidMount被唤起  
App组件组件的componentWillReceiveProps和componentDidUpdate被唤起,因为它依旧渲染只不过是接收到新的props例如  
`children, params, location`  
Home组件不被渲染了所以它不会被镶嵌了  
Invoice首先就被镶嵌了  
+	当用户输入'/index/789',App组件的componentWillReceiveProps,componentDidUpdate被唤起    
Index组件的componentWillReceiveProps, componentDidUpdate被唤起，因为接收到了新的属性，  尽管之前这两个组件  
已经被镶嵌了，但是现在依旧的镶嵌 
+	当用户输入'/about/123',App组件的componentWillReceiveProps,componentDidUpdate被唤起    
Index组件的componentWillUnmount被唤起,About组件的componentDidMount被唤起         
* * *

###Freching Data
可以通过别的方式获取数据，最简单的方法就是将获取来的数据放到state对象中，现在当我们知道当routes（路由）改变的时候组件生命周期的哪些  
方法会被执行之后，我们可以这么做:    
```
class About extends React.Component {
	constructor() {
		super()
		this.state = {
			about: null
		};
	}
	
	componentDidMount() {
		//在这里从后台获取数据
	}
	
	componentDidUpdate() {
		//当参数值改变的时候在这里处理
	}
	
	componentWillUnmount() {
		//当组件将要卸载的时候
	}
	
	fetchData() {
	
	}
}
```  

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
-	当我们想在当url="/"时渲染一个模块,可以用<IndexRoute component={xxx} />来指定一个默认页,这App组件的render()方法中  
的{this.props.childern}就是<DefaultPage>组件
3.	路由优先级,routing的算法规则是按照route的定义顺序执行的,所以当你有两个相同的path时，会路由到你先定义的模块去  
4.	我们可以通过react-router的this.props.location.query.paramName得到url中传的参数值  
