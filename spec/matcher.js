export default {
  // Passes if the given value is instance of the expected constructor.
  toBeInstanceOf: function(util, customEqualityTesters) {
    return {
      compare: function(actual, expected) {
        return {
          pass: actual instanceof expected
        };
      }
    };
  }
};
