const { isFunc } = _private;

describe('isFunc (white box tests)', () => {

  it('returns ‘true’ if argument is a function', () => {
    expect(isFunc(() => {})).toBe(true);
  });

  it('returns ‘false’ if argument is not a function', () => {
    [null, undefined, true, false, '', '0', ' ', {}, []].forEach(value => {
      expect(isFunc(value)).toBe(false);
    });
  });

});
