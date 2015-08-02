export default () => {

  describe('creates a source Observable that', () => {

    it('can be type checked with instanceof', () => {
      expect(O(() => {})).toBeInstanceOf(O);
      // Also works with ‘new’
      expect(new O(() => {})).toBeInstanceOf(O);
    });

    it('has no output if end callback is called directly', done => {
      const o = O((_, end) => { end(); });
      observe({ o }, observed => {
        expect(observed).toEqual({});
        done();
      });
    });

    it('ignores pushed undefined values', done => {
      const o = O((push, end) => {
        push(undefined);
        end();
      });
      observe({ o }, observed => {
        expect(observed).toEqual({});
        done();
      });
    });

    it('can push everything but undefined', done => {
      const o = O((push, end) => {
        R.forEach(push)([ 42, null, true, false, 0, [], 'foo', { foo: 'bar' } ]);
        end();
      });
      observe({ o }, observed => {
        expect(observed).toEqual({
          o: [42, null, true, false, 0, [], 'foo', { foo: 'bar' }]
        });
        done();
      });
    });

    it('can push/end with interval', done => {
      let i = 25;
      const o1 = O((push, end) => {
        R.forEach(value => {
          push(value, i += 5);
        })([1, 2, 3, 4]);
        end(150);
      });
      let j = 10;
      const o2 = O((push, end) => {
        R.forEach(value => {
          push(value, j += 10);
        })([5, 6, 7, 8, 9]);
        end(100);
      });
      observe({ o1, o2 }, observed => {
        expect(observed).toEqual({
          o1:   [   ,  1,   ,  2,  3,  ,  4,   ,   ,    ,   ],
          o2:   [  5,   ,  6,   ,   , 7,   ,  8,  9    ],
          time: [ 20, 30,   , 35, 40,  , 45, 50, 60, 100, 150 ]
        });
        done();
      });
    });

    it('ignores values pushed after observable end', done => {
      const o = O((push, end) => {
        push(2, 5);
        push(4, 10);
        end(10);
        _setTimeout(() => {
          push(3, 4);
        }, 5);
        push(5, 10);
        push(1);
        push(6, 11);
      });
      observe({ o }, observed => {
        expect(observed).toEqual({
          o:    [ 1, 2, 3,  4  ],
          time: [  , 5, 9, 10,  , ]
        });
        done();
      });
    });

    it('lets errors pass through', () => {
      expect(() => {
        O((push, end) => {
          push(42);
          _setTimeout(end, 0);
          throw 'fooo';
        });
      }).toThrow('fooo');
    });

  });

};
