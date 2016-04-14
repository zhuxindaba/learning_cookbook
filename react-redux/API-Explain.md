#Redux API和词汇解释
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
		
</br>
- **Action Creator**    

</br>
- **异步Action**    

</br>
- **Middleware**    

</br>
- **Store**    

</br>
- **Store Creator**    

</br>
- **Store enhancer**    
