// Error type definition and private helper functions.

// Constructor function of a functional error which can hold a value of any type besides undefined. Should not be used
// but in the next function definition.
// * -> OError
const _OError = function(error) {
  this._ = error;
};

// Use this function to wrap any value besides undefined to be able to identify this value as a functional error.
// * -> OError
const OError = error => new _OError(error);

// Unwrap a wrapper instance and get back the value (anything besides undefined) which represents a functional error.
const unwrapOError = oError => oError._;

// true if the given value is a wrapped functional error.
const isOError = any => any instanceof _OError;

// Export function to namespace
Observable.Error = OError;
