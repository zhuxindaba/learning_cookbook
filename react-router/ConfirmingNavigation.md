###确认是否离开此页面
- - -
当你需要在离开此页面的时候给用户一个提醒，你可以用routerWillLeave这个方法,例如
```
class Index extends React.Component {
	
	constructor() {
		super();
	}
	
	componentDidMount() {
		this.context.router.setRouteLeaveHool(this.props.route, this.routerWillLeave);
	}
	
	routerWillLeave() {
		//这里默认的就是js的confirm函数
		return 'do u want leave this page?';
	}
	
	render(
		return();
	)
}
Index.contextTypes = {
	router: React.PropTypes.object;
}
```