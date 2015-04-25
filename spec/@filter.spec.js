import util from './util';

const { observe } = util;

describe('@.filter', () => {

  const isNotTwo = x => x !== 2;

  it('filters values', done => {
    const o0 = O.fromArray([1, 2, 3, 4]);
    const o = o0.filter(isNotTwo);
    observe(o0, o, output => {
      expect(output).toBe(
        '[ 1   2 3   4   ]' +
        '[   1     3   4   ]');
      done();
    });
  });

});
