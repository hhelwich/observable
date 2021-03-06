import util from './util';
import customMatchers from './matcher';

const { observe } = util;

describe('O.fromArray', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
  });

  it('emits all values asynchronously', done => {
    const o = O.fromArray([1, 2, 3, 4, 5]);
    observe(o, flow => {
      expect(flow).toBe('[ 1 2 3 4 5 ]');
      done();
    });
  });

  it('emits values time-shared', done => {
    const o1 = O.fromArray([1, 2, 3, 4, 5]);
    const o2 = O.fromArray([6, 7, 8, 9]);
    observe(o1, o2, output => {
      expect(output).toBe(
        '[ 1   2   3   4   5   ]' +
        '[   6   7   8   9   ]');
      done();
    });
  });

});
