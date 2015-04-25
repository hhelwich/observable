import util from './util';

const { observe } = util;

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
    observe(o0, o, output => {
      expect(output).toBe(
        '[ 1   2   3        4    ]' +
        '[   1   4   !ooops   16   ]');
      done();
    });
  });

});
