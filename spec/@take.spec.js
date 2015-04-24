import util from './util';

const { dataOf } = util;

describe('@.take', () => {

  it('takes values', done => {
    const o0 = O.fromArray([1, 2, 3, 4]);
    const o = o0.take(3);
    dataOf(o0, o, data => {
      expect(data).toBe(
        '[ 1   2   3     4 ]' +
        '[   1   2   3 ]');
      done();
    });
  });

});
