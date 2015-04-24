import util from './util';

const { Observable, dataOf } = util;

describe('O.take', () => {

  let o0 = null;

  beforeEach(() => {
    o0 = Observable('0 1 2 3 !foo 5 6,7 8 9,!oops, 10');
  });

  it('takes values and ends', done => {
    const o = O.take(3, o0);
    dataOf(o0, o, data => {
      expect(data).toBe(
        '[ 0   1   2     3 !foo 5 6,7 8 9,!oops 10 ]' +
        '[   0   1   2 ]');
      done();
    });
  });

  it('keeps errors but they do not count', done => {
    const o = O.take(9, o0);
    dataOf(o0, o, data => {
      expect(data).toBe(
        '[ 0   1   2   3   !foo      5   6,7     8   9,!oops     10 ]' +
        '[   0   1   2   3      !foo   5     6 7   8         9 ]');
      done();
    });
  });

  it('takes until end if count is greater than length', done => {
    const o = O.take(100, o0);
    dataOf(o0, o, data => {
      expect(data).toBe(
        '[ 0   1   2   3   !foo      5   6,7     8   9,!oops         10    ]' +
        '[   0   1   2   3      !foo   5     6 7   8         9 !oops    10   ]');
      done();
    });
  });

});
