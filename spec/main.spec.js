import another from './another.spec';

describe('main test', () => {

  it('should import correctly', () => {
    expect(myApp).toEqual({ foo: 42 });
  });

});
