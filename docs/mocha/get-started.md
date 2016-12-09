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

##### 专一的测试

> 专一的特性允许运行给函数添加`only()`来运行指定的测试，下面的例子就是执行只有一个指定的套件

```
describe('Array', function() {
  describe.only('#indexOf()', function() {
    // ...
  });
});

```

> **注意:**所有内置的套件仍然会继续执行，例:

```
describe('Array', function() {
  describe('#indexOf()', function() {
    it.only('should return -1 unless present', function() {
      // ...
    });

    it('should return the index when present', function() {
      // ...
    });
  });
});
```

> **警告：**如果有多个`only()`回掉，测试套件的结果可能是意外的表现。

##### 包含的测试

> 这个特性和`.only()`相反，通过`.skip()`告诉Mocha忽略这些套件或者测试用例，所有跳过的  
> 测试都会被标记上`pending`,例如:

```
describe('Array', function() {
  describe.skip('#indexOf()', function() {
    // ...
  });
});
```

> 或者在一个明确的测试用例中:

```
describe('Array', function() {
  describe('#indexOf()', function() {
    it.skip('should return -1 unless present', function() {
      // ...
    });

    it('should return the index when present', function() {
      // ...
    });
  });
});


```

> 使用`.skip()`输出说明/注释， 可以在运行中使用`this.skip()`,如果一个测试需要环境相关  
> 的配置文件，并且在事先检测不到的，运行时skip就比较合适了.

```
it('should only test in the correct environment', function() {
  if (/* check test environment */) {
    // make assertions
  } else {
    this.skip();
  }
});
```

> 上面的例子将会上报`pending`,注意当调用`this.skip()`会终止当前的test  
> **Best practice：**为了避免困惑，在调用`this.skip()`之后不要执行进一步的指令
>
> 当前代码与上面例子的对比

```
it('should only test in the correct environment', function() {
  if (/* check test environment */) {
    // make assertions
  } else {
    // do nothing
  }
});
```

> 因为这个测试没做任何事，他被上报为`passing`,在测试用力中，不要不做任何事，一个测试应该  
> 创建一个断言或者使用`this.skip()`. 在`before`钩子里使用`this.skip()`跳跃多个测试用例

```
before(function() {
  if (/* check test environment */) {
    // setup code
  } else {
    this.skip();
  }
});


```

##### 重试测试

> 可以决定重操作测试用例的次数，这个特性设计处理端对端测试(),**不建议用在单元测试中**  
> 这个特性在`beforeEach/afterEach`中重复运行，`before/after`中不行。  
> **注意**下面的例子是卸载web应用测试中的(会覆盖全局Mocha钩子)

```
describe('retries', function() {
  // Retry all tests in this suite up to 4 times
  this.retries(4);

  beforeEach(function () {
    browser.get('http://www.yahoo.com');
  });

  it('should succeed on the 3rd try', function () {
    // Specify this test to only retry up to 2 times
    this.retries(2);
    expect($('.foo').isDisplayed()).to.eventually.be.true;
  });
});

```

##### 动态生成测试

```
var assert = require('chai').assert;

function add() {
  return Array.prototype.slice.call(arguments).reduce(function(prev, curr) {
    return prev + curr;
  }, 0);
}

describe('add()', function() {
  var tests = [
    {args: [1, 2],       expected: 3},
    {args: [1, 2, 3],    expected: 6},
    {args: [1, 2, 3, 4], expected: 10}
  ];

  tests.forEach(function(test) {
    it('correctly adds ' + test.args.length + ' args', function() {
      var res = add.apply(null, test.args);
      assert.equal(res, test.expected);
    });
  });
});


```
