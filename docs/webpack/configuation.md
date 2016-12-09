###webpack的api说明  
> context: 定义入口文件所在的目录  
> entry: 打包js的入口文件，既可以是字符串也可以是数组，定义数组的话，只有数组的最后一个元素会被当作入口文件,如果定义多入口文件，需要以对象的形式定义：

```
entry: {
    page1: './page1',
    page2: './page2'
}
```

> output:
