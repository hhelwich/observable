import util from './util';
import customMatchers from './matcher';

const { Observable, async, counter, dataOf } = util;

describe('O.once', () => {

  it('emits one single value', done => {
    const o = O.once(42);
    dataOf(o, data => {
      expect(data).toBe('[ 42 ]');
      done();
    });
  });

});
