import util from './util';

const { observe } = util;

describe('@.take', () => {

  it('takes values', done => {
    const o0 = O.fromArray([1, 2, 3, 4]);
    const o = o0.take(3);
    observe(o0, o, output => {
      expect(output).toBe(
        '[ 1   2   3     4 ]' +
        '[   1   2   3 ]');
      done();
    });
  });

});
