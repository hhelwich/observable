const _ = _private;

describe('_copyArray', () => {

  it('copies an array', () => {
    const a = [1, 2, 3];
    const b = _.copyArray(a);
    expect(a).toEqual([1, 2, 3]);
    expect(b).toEqual(a);
    expect(b).not.toBe(a);
  });

});
