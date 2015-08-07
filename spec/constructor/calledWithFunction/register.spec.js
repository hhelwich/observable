import { getStackCount } from '../../_helper/asyncMock';

export default () => {

  describe('which can return a register callback that', () => {

    it('is not called if observable has no listener', done => {
      let registered = false;
      let _end;
      O((_, end) => {
        _end = end;
        return () => {
          registered = true;
        };
      });
      _setTimeout(() => {
        expect(registered).toBe(false);
        _end();
        done();
      });
    });

    it('is called without arguments', done => {
      O((_, end) => function() {
        expect(arguments.length).toBe(0);
        end();
        done();
      }).take(1);
    });

    it('is called synchronously on register time', done => {
      let registerStackCount = null;
      const o = O((_, end) => () => {
        // Expect register function to be called synchronously on register.
        expect(getStackCount()).toBe(registerStackCount);
        end();
        done();
      });
      _setTimeout(() => {
        registerStackCount = getStackCount();
        o.take(1);
      });
    });

    it('is not called on successive listener registration', done => {
      let registerCount = 0;
      let _end;
      const o = O((_, end) => {
        _end = end;
        return () => {
          registerCount += 1;
        };
      });
      o.take(1);o.take(1);o.take(1);
      _setTimeout(() => {
        expect(registerCount).toBe(1);
        _end();
        done();
      });
    });

    it('is called on re-registration', done => {
      let _push;
      let _end;
      let registerCount = 0;
      const o = O((push, end) => {
        _push = push;
        _end = end;
        push(42);
        push(11);
        return () => {
          registerCount += 1;
        };
      });
      o.take(1);o.take(1);
      o.take(2).onEnd(() => {
        expect(registerCount).toBe(1);
        o.take(1).onEnd(() => {
          expect(registerCount).toBe(2);
          _end();
          done();
        });
        _push(12);
      });
    });

    describe('can return an unregister callback that', () => {

      it('is called without arguments', done => {
        O((push, end) => () => {
          push(42);
          return function() {
            expect(arguments.length).toBe(0);
            end();
            done();
          };
        }).take(1);
      });

      it('is called synchronously on unregister time', done => {
        let unregisterStackCount = null;
        let _end;
        O((push, end) => () => {
          _end = end;
          push(42);
          return () => {
            unregisterStackCount = getStackCount();
          };
        }).take(1).onEnd(() => {
          expect(getStackCount()).toBe(unregisterStackCount);
          _end();
          done();
        });
      });

      it('is called after last listener unregisters', done => {
        let unregisterStackCount = null;
        let _end;
        const o = O((push, end) => () => {
          _end = end;
          push(42);
          push(11, 10);
          return () => {
            unregisterStackCount = getStackCount();
          };
        });
        o.take(1);o.take(1);
        o.take(2).onEnd(() => {
          expect(getStackCount()).toBe(unregisterStackCount);
          _end();
          done();
        });
      });

      it('is called maximal once per instance', done => {
        let unregisterCount = 0;
        let _push;
        let _end;
        const o = O((push, end) => {
          _push = push;
          _end = end;
          return () => {
            push(42);
            let unregisterCalled = false;
            return () => {
              expect(unregisterCalled).toBe(false);
              unregisterCount += 1;
              unregisterCalled = true;
            };
          };
        });
        o.take(1).onEnd(() => {
          o.take(1).onEnd(() => {
            expect(unregisterCount).toBe(2);
            _end();
            done();
          });
          _push(11);
        });
      });

    });

  });

};
