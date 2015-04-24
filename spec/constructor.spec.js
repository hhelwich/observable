import util from './util';
import customMatchers from './matcher';

const { async, counter, dataOf } = util;

describe('O', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
  });

  it('is callable as function', done => {
    const obs = O((push, next) => {
      next(() => {
        push(42);
      });
    });
    expect(obs).toBeInstanceOf(O);
    dataOf(obs, data => {
      expect(data).toBe('[ 42 ]');
      done();
    });
  });

  it('is callable with “new”', done => {
    const obs = new O(function(push, next) {
      next(() => {
        push(42);
      });
    });
    expect(obs).toBeInstanceOf(O);
    dataOf(obs, data => {
      expect(data).toBe('[ 42 ]');
      done();
    });
  });

  it('preserves context', done => {
    const obs = O(function(_, next) {
      const _this = this;
      next(() => {
        expect(_this).toBe(obs);
        expect(this).toBe(obs);
        done();
      });
    });
  });

  it('can be empty', done => {
    const obs = O(() => {});
    dataOf(obs, data => {
      expect(data).toBe('[ ]');
      done();
    });
  });

  it('allows to push values synchronously and asynchronously', done => {
    const obs = O(function(push, next) {
      next(() => {
        next(() => {
          push(33);
          push(77);
        });
        push(11);
        push(12);
        push(42);
      });
    });
    dataOf(obs, data => {
      expect(data).toBe('[ 11,12,42 33,77 ]');
      done();
    });
  });

  it('allows to push values and errors synchronously and asynchronously', done => {
    const obs = O(function(push, next) {
      next(() => {
        push(77);
        next(() => {
          push(11);
          throw 'foo';
        });
        push(42);
      });
    });
    dataOf(obs, data => {
      expect(data).toBe('[ 77,42 11,!foo ]');
      done();
    });
  });

  describe('register/deregister', () => {

    it('registers on first listener', done => {
      const order = counter();
      const obs = O(function(push) {
        expect(order()).toBe(0); // Constructor function is called synchronously
        // Return register function
        return () => { // Register function
          expect(order()).toBe(3);
          async(() => {
            push(42);
          });
          // Return de-register function
          return () => { // All listeners have been removed => de-register
            expect(order()).toBe(5);
            done();
          };
        };
      });
      expect(order()).toBe(1);
      async(() => {
        expect(order()).toBe(2);
        // Attach listener to observable => register function should be called
        const removeListener = obs.forEach(v => {
          expect(order()).toBe(4);
          expect(v).toBe(42);
          // Remove single listener => de-register function should be called
          removeListener();
        });
      });
    });

  });
});
