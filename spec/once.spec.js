import util from './util';

const { dataOf } = util;

describe('O.once', () => {

  it('emits one single value', done => {
    const o = O.once(42);
    dataOf(o, data => {
      expect(data).toBe('[ 42 ]');
      done();
    });
  });

});
