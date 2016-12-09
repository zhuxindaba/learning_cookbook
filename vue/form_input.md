---
title: form input绑定
categories:
- Vue
---
### 基本用法    
>可以在form表单中的input和textarea中使用`v-model`指令创建双向绑定。它会自动的挑选正确的
>方式来更新基于input类型的元素。`v-model`本质上是基于用户输入事件来更改data的语法糖，以及
>对一些边缘情况的特殊照顾。`v-model`不会关心input或textarea的初始值，它只会处理vue实例
>的data。

#### Text    

```
<input v-model="message" placeholder="edit me">
<p>Message is: {{ message }}</p>
```
>input输入框的值是'edit me'

#### 多行文本    

```
<span>Multiline message is:</span>
<p style="white-space: pre">{{ message }}</p>
<br>
<textarea v-model="message" placeholder="add multiple lines"></textarea>
```
>在textarea插入文本值`<textarea>{{text}}</textarea>`不会工作，使用`v-model`代替。

#### Checkbox     

>单个复选框，布尔值：

```
<input type="checkbox" id="checkbox" v-model="checked">
<label for="checkbox">{{ checked }}</label>
```
>多个复选框，绑定同一个数组：

```
<input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
<label for="jack">Jack</label>
<input type="checkbox" id="john" value="John" v-model="checkedNames">
<label for="john">John</label>
<input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
<label for="mike">Mike</label>
<br>
<span>Checked names: {{ checkedNames }}</span>

new Vue({
  el: '...',
  data: {
    checkedNames: []
  }
})
```

#### Radio    

```
<input type="radio" id="one" value="One" v-model="picked">
<label for="one">One</label>
<br>
<input type="radio" id="two" value="Two" v-model="picked">
<label for="two">Two</label>
<br>
<span>Picked: {{ picked }}</span>
```

#### Select    

```
<select v-model="selected">
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<span>Selected: {{ selected }}</span>
```
>多个选择，绑定数组：

```
<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<br>
<span>Selected: {{ selected }}</span>
```
>通过`v-for`动态渲染的选项：

```
<select v-model="selected">
  <option v-for="option in options" v-bind:value="option.value">
    {{ option.text }}
  </option>
</select>
<span>Selected: {{ selected }}</span>
```

### Value Bindings    
>对于radio,checkbox,select选项，`v-modle`的绑定值通常是静态的字符串（checkbox是布尔值）

```
<!-- `picked` is a string "a" when checked -->
<input type="radio" v-model="picked" value="a">
<!-- `toggle` is either true or false -->
<input type="checkbox" v-model="toggle">
<!-- `selected` is a string "abc" when selected -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```
>但是有时候，我们需要绑定vue实例的动态的属性的值，我们可以通过`v-bind`来达到这个目的,
>使用`v-bind`允许我们绑定input值为非字符串。

#### Checkbox    

```
<input
  type="checkbox"
  v-model="toggle"
  v-bind:true-value="a"
  v-bind:false-value="b"
>

// when checked:
vm.toggle === vm.a
// when unchecked:
vm.toggle === vm.b
```

#### Radio    

```
<input type="radio" v-model="pick" v-bind:value="a">

// when checked:
vm.pick === vm.a
```

#### Select Options    

```
<select v-model="selected">
  <!-- inline object literal -->
  <option v-bind:value="{ number: 123 }">123</option>
</select>

// when selected:
typeof vm.selected // -> 'object'
vm.selected.number // -> 123
```

### 修饰符     

#### .lazy    
>默认情况下，`v-model`在输入事件后同步输入值，你可以添加`.lazy`修饰符开代替`change`事件

```
<!-- synced after "change" instead of "input" -->
<input v-model.lazy="msg" >
```

#### .number    
>如果你想要用户输入自动转换为数字，以可以添加在`v-model`后添加`number`修饰符来控制输入

```
<input v-model.number="age" type="number">
```
>这个很有用，因为`type="number"`返回的是一个字符串。

#### .trim    
>如果你想自动的去掉用户输入的空格，可以在`v-model`后添加'.trim'来控制用户输入

```
<input v-model.trim="msg">
```

### v-model with Components    
>Html的内置输入类型总是不能满足你的需求，幸运的是，Vue组件允许你构建具有完全自定义行为的
>input,这些input实际上工作方式还是`v-model`,可以在自定义input中了解。
