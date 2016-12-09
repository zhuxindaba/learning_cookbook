> Mocha允许开发者从他们的DSL中选择想要的形式，Mocha有**BDD**,**TDD**,**Exports**,**QUnit**,**Require**形式的接口.

####BDD  
>BDD接口提供了`describe(), context(), it(), specify(), before(), after(), beforeEach(), afterEach()`。  
> `context()`是`describe()`的别名，并且表现方式一样，它只是使之易读易组织，同样的，`specify`也是`it`的别名。

```
describe('Array', function() {
  before(function() {
    // ...
  });

  describe('#indexOf()', function() {
    context('when not present', function() {
      it('should not throw an error', function() {
        (function() {
          [1,2,3].indexOf(4);
        }).should.not.throw();
      });
      it('should return -1', function() {
        [1,2,3].indexOf(4).should.equal(-1);
      });
    });
    context('when present', function() {
      it('should return the index where the element first appears in the array', function() {
        [1,2,3].indexOf(3).should.equal(2);
      });
    });
  });
});
```

#### TDD

> TDD接口提供了`suite(), test(), suiteSetup(), suiteTeardown(), setup(), teardown()`

```
suite('Array', function() {
  setup(function() {
    // ...
  });

  suite('#indexOf()', function() {
    test('should return -1 when not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});
```

#### Exports

> Exports接口很像Mocha的前身`expresso`,'before, after, beforeEach, afterEach'这些键是特殊的情况，  
> 对象值就是套件并且函数值是测试用例:

```
module.exports = {
  before: function() {
    // ...
  },

  'Array': {
    '#indexOf()': {
      'should return -1 when not present': function() {
        [1,2,3].indexOf(4).should.equal(-1);
      }
    }
  }
};
```

#### QUnit

```
function ok(expr, msg) {
  if (!expr) throw new Error(msg);
}

suite('Array');

test('#length', function() {
  var arr = [1,2,3];
  ok(arr.length == 3);
});

test('#indexOf()', function() {
  var arr = [1,2,3];
  ok(arr.indexOf(1) == 0);
  ok(arr.indexOf(2) == 1);
  ok(arr.indexOf(3) == 2);
});

suite('String');

test('#length', function() {
  ok('foo'.length == 3);
});

```

#### Require

```
var testCase = require('mocha').describe;
var pre = require('mocha').before;
var assertions = require('mocha').it;
var assert = require('chai').assert;

testCase('Array', function() {
  pre(function() {
    // ...
  });

  testCase('#indexOf()', function() {
    assertions('should return -1 when not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});

```
