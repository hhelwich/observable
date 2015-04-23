import util from './util';
import customMatchers from './matcher';

const { Observable, async, counter, dataOf } = util;

describe('@.map', () => {

  const square = x => {
    if (x === 3) {
      throw 'ooops';
    }
    return x * x;
  };

  it('maps values', done => {
    const o0 = O.fromArray([1, 2, 3, 4]);
    const o = o0.map(square);
    dataOf(o0, o, data => {
      expect(data).toBe(
        '[ 1   2   3        4    ]' +
        '[   1   4   !ooops   16   ]');
      done();
    });
  });

});
