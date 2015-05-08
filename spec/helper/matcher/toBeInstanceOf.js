export default {
  // Passes if the given value is instance of the expected constructor.
  toBeInstanceOf() {
    return {
      compare(actual, expected) {
        return {
          pass: actual instanceof expected
        };
      }
    };
  }
};
