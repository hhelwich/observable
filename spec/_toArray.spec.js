const _ = _private;

describe('_toArrary', () => {

  it('converts argument object to array', () => {
    const fn = function() {
      expect(_.toArray(arguments)).toEqual([1, 2, 3]);
    };
    fn(1, 2, 3);
  });

});
