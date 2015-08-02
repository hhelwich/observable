const { isFunction } = _private;

export default () => {

  describe('isFunction()', () => {

    it('returns ‘true’ if argument is a function', () => {
      expect(isFunction(() => {})).toBe(true);
    });

    it('returns ‘false’ if argument is not a function', () => {
      [null, undefined, true, false, '', '0', ' ', {}, []].forEach(value => {
        expect(isFunction(value)).toBe(false);
      });
    });

  });

};
