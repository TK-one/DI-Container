describe('DIContaniner', function () {
  var container;
  beforeEach(function () {
    container = new DiContainer();
  });

  describe('register(name, dependencies, func)', function () {
    it('with bad parameter function should fail', function () {
      var badArgs = [
        [],
        ['Name'],
        ['Name', ['dependencies1','dependencies2']],
        ['Name', function () {}],
        [1, ['a','b'], function () {}],
        ['Name', [1, 2], function () {}],
        ['Name', ['dep1', 'dep2'], 'should be a function']
      ];

      badArgs.forEach(function (args) {
        expect(function () {
          container.register.apply(container, args)
        }).toThrow();
      });
    });
  });

  describe('get(name)', function () {
    it('if name is not registered, return undefined', function () {
      expect(container.get('notDefined')).toBeUndefined();
    });

    it('return registered function\'s result', function () {
      var name = 'name',
          returnFromRegisteredFunction = 'something';

      container.register(name, [], function () {
        return returnFromRegisteredFunction;
      });

      expect(container.get(name)).toBe(returnFromRegisteredFunction);
    });
  });

  describe('get(name) with dependencies', function () {
    it('provide dependencies to function', function () {
      var main = 'main',
          mainFunc,
          dep1 = 'dep1',
          dep2 = 'dep2';

      container.register(main, [dep1, dep2], function (dep1Func, dep2Func) {
        return function () {
          return dep1Func() + dep2Func();
        };
      });

      container.register(dep1, [], function () {
        return function () {
          return 1;
        };
      });

      container.register(dep2, [], function () {
        return function () {
          return 2;
        };
      });

      mainFunc = container.get(main);
      expect(mainFunc()).toBe(3);
    });
  });
});