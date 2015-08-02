const { cloneArray } = _private;

export default () => {

  describe('cloneArray()', () => {

    it('shallow copies an array', () => {
      const obj = {};
      const a = [1, 2, obj];
      const b = cloneArray(a);
      // Input unchanged
      expect(a).toEqual([1, 2, {}]);
      // Output is shallow copy
      expect(b).not.toBe(a);
      expect(b).toEqual(a);
      expect(b[2]).toBe(a[2]);
    });

    it('shallow copies argument object to array', () => {
      const fn = function() {
        expect(R.type(arguments)).toBe('Arguments');
        const cloned = cloneArray(arguments);
        expect(R.type(cloned)).toBe('Array');
        expect(cloned).toEqual([1, 2, 3]);
      };
      fn(1, 2, 3);
    });
    
  });

};
