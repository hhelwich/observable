import util from './util';

const { observe } = util;

describe('O.once', () => {

  it('emits one single value', done => {
    const o = O.once(42);
    observe(o, output => {
      expect(output).toBe('[ 42 ]');
      done();
    });
  });

});
