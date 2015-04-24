const _ = _private;

describe('_curryObs', () => {

  it('allows optional arguments', () => {
    const o1 = O(() => {});
    const o2 = O(() => {});
    let f = function() {
      return _.toArray(arguments);
    };

    f = _.curryObs(2, f);
    const expected = [o1, o2, 1, 2, 3];
    let f0 = f(1);
    let f1 = f0(2);
    let f2 = f1(3);
    expect(f2(o1)(o2)).toEqual(expected);
    expect(f2(o1, o2)).toEqual(expected);
    expect(f1(3, o1)(o2)).toEqual(expected);
    expect(f1(3, o1, o2)).toEqual(expected);
    f1 = f0(2, 3);
    expect(f1(o1)(o2)).toEqual(expected);
    expect(f1(o1, o2)).toEqual(expected);
    expect(f0(2, 3, o1)(o2)).toEqual(expected);
    expect(f0(2, 3, o1, o2)).toEqual(expected);
    f0 = f(1, 2);
    f1 = f0(3);
    expect(f1(o1)(o2)).toEqual(expected);
    expect(f1(o1, o2)).toEqual(expected);
    expect(f0(3, o1)(o2)).toEqual(expected);
    expect(f0(3, o1, o2)).toEqual(expected);
    f0 = f(1, 2, 3);
    expect(f0(o1)(o2)).toEqual(expected);
    expect(f0(o1, o2)).toEqual(expected);
    expect(f(1, 2, 3, o1)(o2)).toEqual(expected);
    expect(f(1, 2, 3, o1, o2)).toEqual(expected);
  });
});
