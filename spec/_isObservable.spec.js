import util from './util';
import customMatchers from './matcher';

const { Observable, async, counter, dataOf } = util;
const _ = _private;

describe('_isObservable', () => {

  it('returns `true` if argument is an observable', () => {
    expect(_.isObservable(O(() => {}))).toBe(true);
    expect(_.isObservable(new O(() => {}))).toBe(true);
  });

  it('returns `false` if argument is not an observable', () => {
    const _ref = [null, void 0, true, false, '', '0', ' ', {}, [], () => {}];
    const _len = _ref.length;
    for (let _i = 0; _i < _len; _i++) {
      let v = _ref[_i];
      expect(_.isObservable(v)).toBe(false);
    }
  });

});
