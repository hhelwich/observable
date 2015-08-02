export default () => {

  describe('called with no argument', () => {

    describe('creates an Observable that', () => {

      it('can be type checked with instanceof', () => {
        expect(O()).toBeInstanceOf(O);
        // Also works with ‘new’
        expect(new O()).toBeInstanceOf(O);
      });

      it('ends directly with no output', done => {
        observe({ o: O() }, observed => {
          expect(observed).toEqual({});
          done();
        });
      });
    });

  });

};
