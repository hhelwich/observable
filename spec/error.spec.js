const { OError, isOError, unwrapOError } = _private;

describe('OError (white box test)', () => {

  it('is exported as O.Error', () => {
    expect(OError).toBe(O.Error);
  });

});

describe('isOError (white box test)', () => {

  it('returns true for wrapped functional errors (anything besides undefined)', () => {
    [null, 0, 1, '', 'foo', '0', [], {}, () => {}].forEach(value => {
      let error = OError(value);
      expect(isOError(error)).toBe(true);
      // Works also if created with ‘new’
      error = new OError(value);
      expect(isOError(error)).toBe(true);
    });
  });

  it('returns false for everything else', () => {
    [undefined, null, {}, [], () => {}, 1, 0, Error(), new Error(), O, OError].forEach(other => {
      expect(isOError(other)).toBe(false);
    });
  });

});

describe('unwrapOError (white box test)', () => {

  it('extracts the value of a functional error', () => {
    [null, 0, 1, '', 'foo', '0', [], {}, () => {}].forEach(value => {
      let error = OError(value);
      expect(unwrapOError(error)).toBe(value);
      // Works also if created with ‘new’
      error = new OError(value);
      expect(unwrapOError(error)).toBe(value);
    });
  });

});
