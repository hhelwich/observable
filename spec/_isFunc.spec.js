const _ = _private;

describe('_isFunc', () => {

  it('returns `true` if argument is a function', () => {
    expect(_.isFunc(() => {})).toBe(true);
  });

  it('returns `false` if argument is not a function', () => {
    const _ref = [null, void 0, true, false, '', '0', ' ', {}, []];
    const _len = _ref.length;
    for (let _i = 0; _i < _len; _i++) {
      let v = _ref[_i];
      expect(_.isFunc(v)).toBe(false);
    }
  });

});
