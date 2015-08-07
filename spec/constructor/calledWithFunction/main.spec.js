import { getStackCount } from '../../_helper/asyncMock';

export default () => {

  it('calls synchronously', done => {
    const stackCount = getStackCount();
    O((_, end) => {
      expect(getStackCount()).toBe(stackCount);
      end();
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

  it('passes three functions', done => {
    O(function(_, end) {
      expect(arguments.length).toBe(3);
      for (var i = 0; i < arguments.length; i += 1) {
        expect(typeof arguments[i]).toBe('function');
      }
      end();
      done();
    });
  });

};
