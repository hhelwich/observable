import util from './util';

const { Observable, dataOf } = util;

describe('O.map', () => {

  const square = x => {
    if (x === 3) {
      throw 'ooops';
    }
    return x * x;
  };

  it('maps values', done => {
    const o0 = O.fromArray([1, 2, 3, 4]);
    const o = O.map(square, o0);
    dataOf(o0, o, data => {
      expect(data).toBe(
        '[ 1   2   3        4    ]' +
        '[   1   4   !ooops   16   ]');
      done();
    });
  });

  it('can be curried', done => {
    const o0 = O.fromArray([1, 2, 3, 4]);
    const o = O.map(square)(o0);
    dataOf(o0, o, data => {
      expect(data).toBe(
        '[ 1   2   3        4    ]' +
        '[   1   4   !ooops   16   ]');
      done();
    });
  });

  it('keeps errors untouched', done => {
    const o0 = Observable('1 2 !foo 4');
    const o = O.map(square)(o0);
    dataOf(o0, o, data => {
      expect(data).toBe(
        '[ 1   2   !foo      4    ]' +
        '[   1   4      !foo   16   ]');
      done();
    });
  });

  it('make synchronous values/errors asynchronous', done => {
    const o0 = Observable('1 2,3 4,!foo 6');
    const o = O.map(square)(o0);
    dataOf(o0, o, data => {
      expect(data).toBe(
        '[ 1   2,3          4,!foo         6    ]' +
        '[   1     4 !ooops        16 !foo   36   ]');
      done();
    });
  });

  xit('takes functions with two inputs', done => {
    const minus = (a, b) => a - b;
    const o0 = Observable('1 5 3 2,7 4,!foo !oops 11');
    const o = O.map(minus(o0));
    dataOf(o0, o, data => {
      expect(data).toBe(
        '[ 1 5    3   2,7       4,!foo         !oops      11    ]' +
        '[     -4   2     -1 -5        3 !foo       !oops    -7   ]');
      done();
    });
  });

});
