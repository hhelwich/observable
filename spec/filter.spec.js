import util from './util';

const { Observable, observe } = util;

describe('O.filter', () => {

  const isNotTwo = x => x !== 2;

  it('filters values', done => {
    const o0 = O.fromArray([1, 2, 3, 4]);
    const o1 = O.filter(isNotTwo, o0);
    const o2 = O.filter(isNotTwo)(o0); // also test currying
    observe(o0, o1, o2, output => {
      expect(output).toBe(
        '[ 1     2 3     4     ]' +
        '[   1       3     4     ]' +
        '[     1       3     4     ]');
      done();
    });
  });

  xit('can handle predicate function with more than one parameters', done => {
    const o = O.fromArray([1, 2, 2, 3, 4, 4, 4, 5]);
    const isEqual = (a, b) => a === b;
    const skipDuplicates = O.filter(isEqual);
    observe(o, skipDuplicates(o), output => {
      expect(output).toBe(
        '[ 1   2   2 3   4   4 4 5   ]' +
        '[   1   2     3   4       5   ]');
      done();
    });
  });

});

describe('O.filter', () => {

  let o0 = null;

  beforeEach(() => {
    o0 = Observable('0 1 2 3 !foo 5 6,7 8 9,!oops, 10');
  });

  it('filters values (not errors)', done => {
    const isEven = x => x % 2 === 0;
    const o = O.filter(isEven, o0);
    observe(o0, o, output => {
      expect(output).toBe(
        '[ 0   1 2   3 !foo      5 6,7   8   9,!oops       10    ]' +
        '[   0     2        !foo       6   8         !oops    10   ]');
      done();
    });
  });

  it('emits error if predicate throws', done => {
    const isEven = function(x) {
      if (x === 5 || x === 8) {
        throw 'nooo';
      }
      return x % 2 === 0;
    };
    const o = O.filter(isEven, o0);
    observe(o0, o, output => {
      expect(output).toBe(
        '[ 0   1 2   3 !foo      5       6,7   8       9,!oops       10    ]' +
        '[   0     2        !foo   !nooo     6   !nooo         !oops    10   ]');
      done();
    });
  });

});
