const { isObservable } = _private;

export default () => {

  describe('isObservable()', () => {

    it('returns ‘true’ for Observables', () => {
      R.forEach(observable => {
        expect(isObservable(observable)).toBe(true);
      })([O(), new O(), O([]), new O([]), O([42]), O((_, end) => { end(); })]);
    });

    it('returns ‘false’ for everything else', () => {
      R.forEach(noObservable => {
        expect(isObservable(noObservable)).toBe(false);
      })([undefined, null, true, false, 0, 1, -1, '', 'foo', {}, [], () => {}, O]);
    });

  });

};
