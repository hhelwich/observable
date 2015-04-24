const _ = _private;

describe('_compose', () => {

  const f1 = (x, y) => x * y;
  const f2 = x => x + 3;
  const f3 = x => x * x;

  it('composes one function', () => {
    const f = _.compose(f1);
    expect(f(4, 5)).toBe(20);
  });

  it('composes two functions', () => {
    const f = _.compose(f2, f1);
    expect(f(4, 5)).toBe(23);
  });

  it('composes more functions', () => {
    const f = _.compose(f3, f2, f3, f2, f1);
    expect(f(4, 5)).toBe(283024);
  });

});
