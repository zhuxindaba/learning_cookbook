##### 安装

```
npm install mocha -g
```

##### 快速开始

-	编辑test.js

```
    //安装chai第三方依赖
var assert = require('chai').assert;
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});
```

-	在命令行中执行: `mocha test.js`

##### 断言

> 在mocha中可以使用你想用的断言库,常用的有:  
> - should.js  
> - expect.js  
> - chai  
> - better-assert  
> - unexpected

##### 同步的代码

> 当测试同步代码时，省略回掉函数，Mocha会自动的执行下一个测试用例

```
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      [1,2,3].indexOf(5).should.equal(-1);
      [1,2,3].indexOf(0).should.equal(-1);
    });
  });
});
```

##### 异步的代码

> 在`it()`添加一个回掉函数（通常叫`done`）,Mocha会知道函数执行完毕之后才能执行.

```
describe('User', function() {
  describe('#save()', function() {
    it('should save without error', function(done) {
      var user = new User('Luna');
      user.save(done);
    });
  });
})
```

> 为了更简单，`done()`方法接受error,所以我们直接使用

```
describe('User', function() {
  describe('#save()', function() {
    it('should save without error', function(done) {
      var user = new User('Luna');
      user.save(done);
    });
  });
});
```

##### 使用Promise

> 用Promise代替`done()`回掉函数：

```
beforeEach(function() {
  return db.clear()
    .then(function() {
      return db.save([tobi, loki, jane]);
    });
});

describe('#find()', function() {
  it('respond with matching records', function() {
    return db.find({ type: 'User' }).should.eventually.have.length(3);
  });
});
```

##### 箭头函数

> Mocha不建议是同箭头函数，箭头函数中的绑定this的此法不能访问Mocha的上下文环境

##### Hooks

> Mocha提供了`before()`, `after()`, `beforeEach()`, `afterEach()`，这些被用来设置前置  
> 条件并且测试之后会被清理掉

```
describe('hooks', function() {

  before(function() {
    // runs before all tests in this block
  });

  after(function() {
    // runs after all tests in this block
  });

  beforeEach(function() {
    // runs before each test in this block
  });

  afterEach(function() {
    // runs after each test in this block
  });

  // test cases
});
```

##### 描述钩子

> 所有的带有描述性的钩子都可以被调用，这样使测试可以更容易地找到错误，如果钩子是带有名字  
> 的函数，如果一个钩子没有描述，那么这些函数名就会被用到

```
beforeEach(function() {
  // beforeEach hook
});

beforeEach(function namedFun() {
  // beforeEach:namedFun
});

beforeEach('some description', function() {
  // beforeEach:some description
});
```

##### 异步钩子

> 所有的钩子(`before()`, `after()`, `beforeEach()`, `afterEach()`)可以是异步的也可以  
> 是同步的,和普通的测试用例表现是一样的，例如：

```
describe('Connection', function() {
  var db = new Connection,
    tobi = new User('tobi'),
    loki = new User('loki'),
    jane = new User('jane');

  beforeEach(function(done) {
    db.clear(function(err) {
      if (err) return done(err);
      db.save([tobi, loki, jane], done);
    });
  });

  describe('#find()', function() {
    it('respond with matching records', function(done) {
      db.find({type: 'User'}, function(err, res) {
        if (err) return done(err);
        res.should.have.length(3);
        done();
      });
    });
  });
});
```

##### Root-Level 钩子

> 也可以挑选任意文件并且添加"root-level"的钩子，比如：在所有的`describe()`块外面添加  
> `beforeEach()`,这会使`beforeEach`的毁掉函数在所有的测试用例之前运行，不管这个文件是否  
> 正在运行（因为Mocha有一个隐藏的`describe()`块，叫"root suite"）`
> beforeEach(function() {
>   console.log('before every test in every file');
> });
> `

##### 延时的Root Suite

> 弱国想在运行的suites之前执行异步操作，可以延迟root suite，通过运行`mocha --delay`,这  
> 提供了一个特殊的`run()`函数，在全局上下文中

```
setTimeout(function() {
  // do some setup

  describe('my suite', function() {
    // ...
  });

  run();
}, 5000);
```

##### 等待中的测试

> 等待的测试是没有回掉函数

```
describe('Array', function() {
  describe('#indexOf()', function() {
    // pending test below
    it('should return -1 when the value is not present');
  });
});
```
