const  slice = args => [].slice.call(args);

// Get the maximum string length for the given array of strings (Or other objects with length property).
// :: [string] -> number
const maxLength = strs => strs.map(str => str.length).reduce((p, c) => Math.max(p, c));

// Extend the string to the given size by adding spaces to the left.
// (string, number) -> string
const fillLeft = (str, size) => new Array(size - str.length + 1).join(' ') + str;

// Make all strings in the given array of the same size by adding spaces on the left.
// :: [string] -> [string]
const equalSize = strs => strs.map(str => fillLeft(str, maxLength(strs)));

// Returns true if one of the arrays in the given array is not empty.
// [[*]] -> boolean
const hasData = arrays => arrays.map(array => array.length).filter(length => length > 0).length > 0;

// Returns array which contains the given number of empty arrays.
// :: number -> [[]]
const initData = n => {
  let results = [];
  for (let i = 0; i < n; i += 1) {
    results.push([]);
  }
  return results;
};

// Appends the strings of the second argument to  the string lists of the first argument. Both arguments are assumed to
// have the same length.
// :: ([[string]], [string]) -> [[string]]
const appendStrs = (strs0, strs1) => strs0.map((str0, i) => str0.concat(strs1[i]));

// Returns true if the given substring is contained in the given string.
// :: (string, string) -> boolean
const strContains = (str, sub) => str.indexOf(sub) !== -1;

// Throws if the given string is a problematic value to use together with this unit test utility function.
// If no error is thrown the input value is returned.
// :: string -> string
const verifyStrValue = function(val) {
  const _ref = ' !,[]'.split('');
  const _len = _ref.length;
  for (let _i = 0; _i < _len; _i++) {
    let sub = _ref[_i];
    if (strContains(val, sub)) {
      throw Error('invalid value ' + val);
    }
  }
  return val;
};

const maybeStrToNumber = function(str) {
  const n = parseInt(str, 10);
  if (isNaN(n)) {
    return str;
  } else {
    return n;
  }
};

// Create one string of all results.
// :: [[string]] -> string
const makeResultString = function(results) {
  let result;
  return (function() {
    const _results = [];
    const _len = results.length;
    for (let _i = 0; _i < _len; _i++) {
      result = results[_i];
      _results.push((result.join(' ')).trim());
    }
    return _results;
  }()).join('');
};

const util = {
  // Collect all outputs of the given observables until all are ended and call the given callback with the result
  // converted to string for better readability.
  // :: (Observable<T>..., (string ->)) ->
  dataOf() {
    const args = slice(arguments);
    const observables = R.slice(0, args.length - 1, args);
    const callback = args[args.length - 1];
    const n = observables.length; // Number of observables
    // List of results for each observable in the same order as in the inputs
    let results = observables.map(() => ['[']);
    // List of all values/errors in the order of the occurrence. Same index of the lists imply occurrence in the same
    // stack. Stacks with no error/value will be dropped in the lists.
    let resultsNow = initData(n); // :: [[string]]
    // Number of the given observables which are not ended
    let activeCount = n;
    const next = () => { // To be called at the start of a new stack
      if (hasData(resultsNow)) {
        // Join event strings for each observable and make all strings the same length. Append to result list
        results = appendStrs(results, equalSize(resultsNow.map(result => result.join(','))));
        resultsNow = initData(n); // Reset var to collect next stacks values/errors
      }
    };
    O.onNext(next);
    observables.forEach((observable, i) => {
      observable.forEach(value => { // On value
        resultsNow[i].push(verifyStrValue('' + value));
      }, error => { // On error
        resultsNow[i].push('!' + verifyStrValue('' + error));
      }, () => { // On end
        resultsNow[i].push(']');
        activeCount -= 1;
        if (activeCount === 0) {
          next(); // Make sure all values/errors are collected in the result list
          callback(makeResultString(results));
        }
      });
    });
  },

  // Returns an observable which emits all elements of the given array.
  // :: [*] -> Observable
  Observable(str) {
    const events = str.split(' ');
    return O(function(push, next) {
      var nextGroup;
      nextGroup = () => {
        if (events.length > 0) {
          const _ref = events.shift().split(',');
          const _len = _ref.length;
          for (let _i = 0; _i < _len; _i++) {
            let value = _ref[_i];
            if (value.indexOf('!') === 0) {
              foo();
              throw value.substring(1);
            } else {
              push(maybeStrToNumber(value));
            }
          }
          next(nextGroup);
        }
      };
      var foo = () => {
        next(() => next(nextGroup));
      };
      next(nextGroup);
    });
  },
  async(fn) {
    return setTimeout(fn, 1);
  },
  counter() {
    let count = 0;
    return () => count++;
  }
};

export default util;
