export default () => {

  describe('can create a transmitting Observable that', () => {

    let source = null;

    beforeEach(() => {
      source = O([1, 2, 3, 42]);
    });

    it('can transmit and push/end independently', done => {
      const o = O((push, end, observe) => {
        push(77);
        observe(
          source,
          (value, index) => value % 2 === 0 ? [value, index] : undefined,
          size => 'size: ' + size
        );
        source.onEnd(() => {
          end();
        });
        push('fooo');
      });
      observe({ o }, observed => {
        expect(observed).toEqual({
          o: [ [2, 1], [42, 3], 'size: 4', 77, 'fooo' ]
        });
        done();
      });
    });
  });

};
