---
问题: rn组件的警告，setState should not used in unmount Component
---
思考： setState方法不能在未镶嵌的组建中调用，这就说明setState用在了rn中不合适的生命周期方法中
>解决一: 在constructor()中调用了setState函数，很easy
>解决二: 废了半天的功夫，发现是setInterval惹得祸，所以在组建卸载的时候清楚定时任务
> componentWillunmount 以及clearInterval

## Modal在ios和android的bug解决
在某一个组件中包含两个Modal， 在android下第二个modal在第一个modal上通过传visible:true可以正常显示，
但是在ios上第二个modal不显示，原因是第一个modal完全覆盖第二个modal，解决方式，当第二个modal要显示时
将第一个modal设置为隐藏
