###Constructor的说明

* * *
###ComponentDidMount的说明
仅调用一次
在组件初始化渲染之后立刻调用一次,在生命周期的这个时间点,组件拥有一个DOM展现,你可以通过ReactDOM.findDOMNode(this)获取整个dom节点
也可以访问dom组件中的ref属性代表的组件,可以在该方法中发送ajax请求
原先的this.getDOMNode()已经被弃用了，
* * *