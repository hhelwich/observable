export default () => {

  describe('called with an array argument', () => {

    describe('creates an Observable that', () => {

      it('can be type checked with instanceof', () => {
        expect(O([])).toBeInstanceOf(O);
        // Also works with ‘new’
        expect(new O([])).toBeInstanceOf(O);
      });

      it('emits nothing for an empty array', done => {
        observe({ o: O([]) }, observed => {
          expect(observed).toEqual({});
          done();
        });
      });

      it('emits the array values', done => {
        const o = O([null, 42, -1, 0, 'foo', { fooo: 'bar' }, [ 11 ] ]);
        observe({ o }, observed => {
          expect(observed).toEqual({
            o: [null, 42, -1, 0, 'foo', { fooo: 'bar' }, [ 11 ] ]
          });
          done();
        });
      });

      it('ignores undefined values in the array', done => {
        const o = O([null, undefined, 42, -1, 0, 'foo']);
        observe({ o }, observed => {
          expect(observed).toEqual({
            o: [null, 42, -1, 0, 'foo']
          });
          done();
        });
      });

      xit('emits values after the previous value has been handled', done => {
        const o1 = O([1, 2, 3, 4]);
        const o2 = O([5, 6, 7, 8]);
        observe({ o1, o2 }, observed => {
          expect(observed).toEqual({
            o1: [ 1,  , 2,  , 3,  , 4,  , ],
            o2: [  , 5,  , 6,  , 7,  , 8,  , ]
          });
          done();
        });
      });

    });
  });

};
