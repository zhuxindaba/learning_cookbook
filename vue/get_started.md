---
title: Vue纵览
categories:
- Vue
---

### Vue实例的属性和方法    
>Vue实例通过`var app = new Vue({})`来创建，构造参数接收一个对象，该对象包含的属性有
>`data`, `template`, `el`, `methods`, 生命周期回调函数等等，简单的实例:

```
var vm = new Vue({
    el: '#app',
    data: {
      a: 1
    },
    methods: {
      hello: function() {

      }
    }
});
```

### Vue的生命周期钩子    
>每一个Vue实例在创建的时候都需要经过几个初始化步骤。比如，它需要设置data的监听器，模板的
>编译，将实例镶嵌到DOM上，以及当data修改时更新DOM。沿着这个途径，它会调用一些生命周期的
>钩子,以便给我们一些执行自定义逻辑的机会。比如：`created`钩子当实例创建完成后会调用。

```
var vm = new Vue({
    data: {
      a: 1
    },
    created: function() {
      console.log(this.msg);
    },
    mounted: function() {

    },
    updated: function() {

    },
    destroyed: function() {

    }
});
```
>这些生命钩子调用时，他们的上下文(this)指向当前vue实例。

### 生命周期图    
![lifecycleImg](./lifecycle.png)
