import util from "./util";
import customMatchers from "./matcher";

let { Observable, async, counter, dataOf } = util;

describe("Observable", () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
  });

  describe("constructor", () => {

    it("is callable as function", (done) => {
      let obs = O((push, next) => {
        next(() => {
          push(42);
        });
      });
      expect(obs).toBeInstanceOf(O);
      dataOf(obs, (data) => {
        expect(data).toBe("[ 42 ]");
        done();
      });
    });

    it("is callable with “new”", (done) => {
      let obs = new O(function(push, next) {
        next(() => {
          push(42);
        });
      });
      expect(obs).toBeInstanceOf(O);
      dataOf(obs, (data) => {
        expect(data).toBe("[ 42 ]");
        done();
      });
    });

    it("preserves context", (done) => {
      let obs = O(function(_, next) {
        let context = this;
        next(() => {
          expect(context).toBe(obs);
          expect(this).toBe(obs);
          done();
        });
      });
    });

    it("can be empty", (done) => {
      let obs = O(() => {});
      dataOf(obs, (data) => {
        expect(data).toBe("[ ]");
        done();
      });
    });

    it("allows to push values synchronously and asynchronously", (done) => {
      let obs = O(function(push, next) {
        next(() => {
          next(() => {
            push(33);
            push(77);
          });
          push(11);
          push(12);
          push(42);
        });
      });
      dataOf(obs, (data) => {
        expect(data).toBe("[ 11,12,42 33,77 ]");
        done();
      });
    });

    it("allows to push values and errors synchronously and asynchronously", (done) => {
      let obs = O(function(push, next) {
        next(() => {
          push(77);
          next(() => {
            push(11);
            throw "foo";
          });
          push(42);
        });
      });
      dataOf(obs, (data) => {
        expect(data).toBe("[ 77,42 11,!foo ]");
        done();
      });
    });


    describe("register/deregister", () => {

      it("registers on first listener", (done) => {
        let order = counter();
        let obs = O(function(push, next) {
          expect(order()).toBe(0); // Constructor function is called synchronously
          // Return register function
          return () => { // Register function
            expect(order()).toBe(3);
            async(() => {
              push(42);
            });
            // Return de-register function
            return () => { // All listeners have been removed => de-register
              expect(order()).toBe(5);
              done();
            };
          };
        });
        expect(order()).toBe(1);
        async(() => {
          var removeListener;
          expect(order()).toBe(2);
          // Attach listener to observable => register function should be called
          removeListener = obs.forEach(function(v) {
            expect(order()).toBe(4);
            expect(v).toBe(42);
            // Remove single listener => de-register function should be called
            removeListener();
          });
        });
      });

    });
  });


  describe("global functions", () => {


    describe("fromArray", () => {

      it("emits all values asynchronously", (done) => {
        let o = O.fromArray([1, 2, 3, 4, 5]);
        dataOf(o, (flow) => {
          expect(flow).toBe("[ 1 2 3 4 5 ]");
          done();
        });
      });

      it("emits values time-shared", (done) => {
        let o1 = O.fromArray([1, 2, 3, 4, 5]);
        let o2 = O.fromArray([6, 7, 8, 9]);
        dataOf(o1, o2, (data) => {
          expect(data).toBe(
            "[ 1   2   3   4   5   ]" +
            "[   6   7   8   9   ]");
          done();
        });
      });

    });


    describe("filter", () => {

      let isNotTwo = (x) => {
        return x !== 2;
      };

      it("filters values", (done) => {
        let o0 = O.fromArray([1, 2, 3, 4]);
        let o1 = O.filter(isNotTwo, o0);
        let o2 = O.filter(isNotTwo)(o0); // also test currying
        dataOf(o0, o1, o2, (data) => {
          expect(data).toBe(
            "[ 1     2 3     4     ]" +
            "[   1       3     4     ]" +
            "[     1       3     4     ]");
          done();
        });
      });

      xit("can handle predicate function with more than one parameters", (done) => {
        let o = O.fromArray([1, 2, 2, 3, 4, 4, 4, 5]);
        let isEqual = function(a, b) {
          return a === b;
        };
        let skipDuplicates = O.filter(isEqual);
        dataOf(o, skipDuplicates(o), (data) => {
          expect(data).toBe(
            "[ 1   2   2 3   4   4 4 5   ]" +
            "[   1   2     3   4       5   ]");
          done();
        });
      });

    });


    describe("once", () => {

      it("emits one single value", (done) => {
        let o = O.once(42);
        dataOf(o, (data) => {
          expect(data).toBe("[ 42 ]");
          done();
        });
      });

    });


    describe("map", () => {

      let square = (x) => {
        if (x === 3) {
          throw "ooops";
        }
        return x * x;
      };

      it("maps values", (done) => {
        let o0 = O.fromArray([1, 2, 3, 4]);
        let o = O.map(square, o0);
        dataOf(o0, o, (data) => {
          expect(data).toBe(
            "[ 1   2   3        4    ]" +
            "[   1   4   !ooops   16   ]");
          done();
        });
      });

      it("can be curried", (done) => {
        let o0 = O.fromArray([1, 2, 3, 4]);
        let o = O.map(square)(o0);
        dataOf(o0, o, (data) => {
          expect(data).toBe(
            "[ 1   2   3        4    ]" +
            "[   1   4   !ooops   16   ]");
          done();
        });
      });

      it("keeps errors untouched", (done) => {
        let o0 = Observable("1 2 !foo 4");
        let o = O.map(square)(o0);
        dataOf(o0, o, (data) => {
          expect(data).toBe(
            "[ 1   2   !foo      4    ]" +
            "[   1   4      !foo   16   ]");
          done();
        });
      });

      it("make synchronous values/errors asynchronous", (done) => {
        let o0 = Observable("1 2,3 4,!foo 6");
        let o = O.map(square)(o0);
        dataOf(o0, o, (data) => {
          expect(data).toBe(
            "[ 1   2,3          4,!foo         6    ]" +
            "[   1     4 !ooops        16 !foo   36   ]");
          done();
        });
      });

      xit("takes functions with two inputs", (done) => {
        let add = function(a, b) {
          return a - b;
        };
        let o0 = Observable("1 5 3 2,7 4,!foo !oops 11");
        let o = O.map(add(o0));
        dataOf(o0, o, (data) => {
          expect(data).toBe(
            "[ 1 5    3   2,7       4,!foo         !oops      11    ]" +
            "[     -4   2     -1 -5        3 !foo       !oops    -7   ]");
          done();
        });
      });

    });


    describe("take", () => {

      let o0 = null;

      beforeEach(() => {
        o0 = Observable("0 1 2 3 !foo 5 6,7 8 9,!oops, 10");
      });

      it("takes values and ends", (done) => {
        let o = O.take(3, o0);
        dataOf(o0, o, (data) => {
          expect(data).toBe(
            "[ 0   1   2     3 !foo 5 6,7 8 9,!oops 10 ]" +
            "[   0   1   2 ]");
          done();
        });
      });

      it("keeps errors but they do not count", (done) => {
        let o = O.take(9, o0);
        dataOf(o0, o, (data) => {
          expect(data).toBe(
            "[ 0   1   2   3   !foo      5   6,7     8   9,!oops     10 ]" +
            "[   0   1   2   3      !foo   5     6 7   8         9 ]");
          done();
        });
      });

      it("takes until end if count is greater than length", (done) => {
        let o = O.take(100, o0);
        dataOf(o0, o, (data) => {
          expect(data).toBe(
            "[ 0   1   2   3   !foo      5   6,7     8   9,!oops         10    ]" +
            "[   0   1   2   3      !foo   5     6 7   8         9 !oops    10   ]");
          done();
        });
      });

    });


    describe("filter", () => {

      let o0 = null;

      beforeEach(() => {
        o0 = Observable("0 1 2 3 !foo 5 6,7 8 9,!oops, 10");
      });

      it("filters values (not errors)", (done) => {
        let isEven = function(x) {
          return x % 2 === 0;
        };
        let o = O.filter(isEven, o0);
        dataOf(o0, o, (data) => {
          expect(data).toBe(
            "[ 0   1 2   3 !foo      5 6,7   8   9,!oops       10    ]" +
            "[   0     2        !foo       6   8         !oops    10   ]");
          done();
        });
      });

      it("emits error if predicate throws", (done) => {
        let isEven = function(x) {
          if (x === 5 || x === 8) {
            throw "nooo";
          }
          return x % 2 === 0;
        };
        let o = O.filter(isEven, o0);
        dataOf(o0, o, (data) => {
          expect(data).toBe(
            "[ 0   1 2   3 !foo      5       6,7   8       9,!oops       10    ]" +
            "[   0     2        !foo   !nooo     6   !nooo         !oops    10   ]");
          done();
        });
      });

    });
  });


  describe("methods", () => {


    describe("map", () => {

      let square = (x) => {
        if (x === 3) {
          throw "ooops";
        }
        return x * x;
      };

      it("maps values", (done) => {
        let o0 = O.fromArray([1, 2, 3, 4]);
        let o = o0.map(square);
        dataOf(o0, o, (data) => {
          expect(data).toBe(
            "[ 1   2   3        4    ]" +
            "[   1   4   !ooops   16   ]");
          done();
        });
      });

    });


    describe("filter", () => {

      let isNotTwo = function(x) {
        return x !== 2;
      };

      it("filters values", (done) => {
        let o0 = O.fromArray([1, 2, 3, 4]);
        let o = o0.filter(isNotTwo);
        dataOf(o0, o, (data) => {
          expect(data).toBe(
            "[ 1   2 3   4   ]" +
            "[   1     3   4   ]");
          done();
        });
      });

    });


    describe("take", () => {

      it("takes values", (done) => {
        let o0 = O.fromArray([1, 2, 3, 4]);
        let o = o0.take(3);
        dataOf(o0, o, (data) => {
          expect(data).toBe(
            "[ 1   2   3     4 ]" +
            "[   1   2   3 ]");
          done();
        });
      });

    });
  });


  describe("white box tests", () => {

    let _ = _private;

    describe("toArrary", () => {

      it("converts argument object to array", () => {
        let fn = function(a, b, c) {
          (expect(_.toArray(arguments))).toEqual([1, 2, 3]);
        };
        fn(1, 2, 3);
      });

    });


    describe("copyArray", () => {

      it("copies an array", () => {
        let a = [1, 2, 3];
        let b = _.copyArray(a);
        expect(a).toEqual([1, 2, 3]);
        expect(b).toEqual(a);
        expect(b).not.toBe(a);
      });

    });


    describe("appendArray", () => {

      it("concats two arrays in place", () => {
        let a1 = [1, 2, 3];
        let a2 = [4, 5, 6];
        let a = _.appendArray(a1, a2);
        expect(a).toEqual([1, 2, 3, 4, 5, 6]);
        expect(a).toBe(a1);
        expect(a2).toEqual([4, 5, 6]);
      });

    });


    describe("compose", () => {

      let f1 = (x, y) => {
        return x * y;
      };
      let f2 = (x) => {
        return x + 3;
      };
      let f3 = (x) => {
        return x * x;
      };

      it("composes one function", () => {
        let f = _.compose(f1);
        expect(f(4, 5)).toBe(20);
      });

      it("composes two functions", () => {
        let f = _.compose(f2, f1);
        expect(f(4, 5)).toBe(23);
      });

      it("composes more functions", () => {
        let f = _.compose(f3, f2, f3, f2, f1);
        expect(f(4, 5)).toBe(283024);
      });

    });


    describe("curry", () => {


      it("keeps one argument function", () => {
        let f = _.curry((x) => {
          return x * x;
        });
        expect(f(3)).toBe(9);
      });

      it("curries a function", () => {
        let f = _.curry((a, b, c) => {
          return a + b * c;
        });
        expect(f(2, 3, 4)).toBe(14);
        expect(f(2)(3)(4)).toBe(14);
        expect(f(2, 3)(4)).toBe(14);
        expect(f(2)(3, 4)).toBe(14);
      });

      it("passes arguments if more than expected", () => {
        let f = _.curry(function(a, b) {
          expect(_.toArray(arguments)).toEqual([1, 2, 3]);
        });
        f(1)(2, 3);
      });

      it("can be called with empty arguments", () => {
        let f = _.curry((a, b, c) => {
          return a + b * c;
        });
        expect(f()(1, 2)()()(3)).toBe(7);
      });

    });


    describe("curryObs", () => {

      it("allows optional arguments", () => {
        let o1 = O(() => {});
        let o2 = O(() => {});
        let f = function() {
          return _.toArray(arguments);
        };

        f = _.curryObs(2, f);
        let expected = [o1, o2, 1, 2, 3];
        let f0 = f(1);
        let f1 = f0(2);
        let f2 = f1(3);
        expect(f2(o1)(o2)).toEqual(expected);
        expect(f2(o1, o2)).toEqual(expected);
        expect(f1(3, o1)(o2)).toEqual(expected);
        expect(f1(3, o1, o2)).toEqual(expected);
        f1 = f0(2, 3);
        expect(f1(o1)(o2)).toEqual(expected);
        expect(f1(o1, o2)).toEqual(expected);
        expect(f0(2, 3, o1)(o2)).toEqual(expected);
        expect(f0(2, 3, o1, o2)).toEqual(expected);
        f0 = f(1, 2);
        f1 = f0(3);
        expect(f1(o1)(o2)).toEqual(expected);
        expect(f1(o1, o2)).toEqual(expected);
        expect(f0(3, o1)(o2)).toEqual(expected);
        expect(f0(3, o1, o2)).toEqual(expected);
        f0 = f(1, 2, 3);
        expect(f0(o1)(o2)).toEqual(expected);
        expect(f0(o1, o2)).toEqual(expected);
        expect(f(1, 2, 3, o1)(o2)).toEqual(expected);
        expect(f(1, 2, 3, o1, o2)).toEqual(expected);
      });
    });


    describe("isFunc", () => {

      it("returns `true` if argument is a function", () => {
        expect(_.isFunc(() => {})).toBe(true);
      });

      it("returns `false` if argument is not a function", () => {
        let _ref = [null, void 0, true, false, "", "0", " ", {}, []];
        let _len = _ref.length;
        for (let _i = 0; _i < _len; _i++) {
          let v = _ref[_i];
          expect(_.isFunc(v)).toBe(false);
        }
      });

    });


    describe("isObservable", () => {

      it("returns `true` if argument is an observable", () => {
        expect(_.isObservable(O(() => {}))).toBe(true);
        expect(_.isObservable(new O(() => {}))).toBe(true);
      });

      it("returns `false` if argument is not an observable", () => {
        let _ref = [null, void 0, true, false, "", "0", " ", {}, [], () => {}];
        let _len = _ref.length;
        for (let _i = 0; _i < _len; _i++) {
          let v = _ref[_i];
          expect(_.isObservable(v)).toBe(false);
        }
      });

    });
  });
});
