import util from './util';

const { dataOf } = util;

describe('@.filter', () => {

  const isNotTwo = x => x !== 2;

  it('filters values', done => {
    const o0 = O.fromArray([1, 2, 3, 4]);
    const o = o0.filter(isNotTwo);
    dataOf(o0, o, data => {
      expect(data).toBe(
        '[ 1   2 3   4   ]' +
        '[   1     3   4   ]');
      done();
    });
  });

});
