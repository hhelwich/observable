import util from './util';
import customMatchers from './matcher';

const { Observable, async, counter, dataOf } = util;
const _ = _private;

describe('_appendArray', () => {

  it('concats two arrays in place', () => {
    let a1 = [1, 2, 3];
    let a2 = [4, 5, 6];
    let a = _.appendArray(a1, a2);
    expect(a).toEqual([1, 2, 3, 4, 5, 6]);
    expect(a).toBe(a1);
    expect(a2).toEqual([4, 5, 6]);
  });

});
