const _ = _private;

describe('_curry', () => {

  it('keeps one argument function', () => {
    const f = _.curry(x => x * x);
    expect(f(3)).toBe(9);
  });

  it('curries a function', () => {
    const f = _.curry((a, b, c) => a + b * c);
    expect(f(2, 3, 4)).toBe(14);
    expect(f(2)(3)(4)).toBe(14);
    expect(f(2, 3)(4)).toBe(14);
    expect(f(2)(3, 4)).toBe(14);
  });

  it('passes arguments if more than expected', () => {
    const f = _.curry(function(a, b) {
      expect(a).toBe(1);
      expect(b).toBe(2);
      expect(_.toArray(arguments)).toEqual([1, 2, 3]);
    });
    f(1)(2, 3);
  });

  it('can be called with empty arguments', () => {
    const f = _.curry((a, b, c) => a + b * c);
    expect(f()(1, 2)()()(3)).toBe(7);
  });

});
