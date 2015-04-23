const  __slice = [].slice;

// Get the maximum string length for the given array of strings
// :: [string] -> number
const maxLength = function(strs) {
  let max = 0;
  const _len = strs.length;
  for (let _i = 0; _i < _len; _i++) {
    let str = strs[_i];
    max = Math.max(max, str.length);
  }
  return max;
};

// Extend the string to the given size by adding spaces to the left.
// (string, number) -> string
const fillLeft = function(str, size) {
  return new Array(size - str.length + 1).join(' ') + str;
};

// Make all strings in the given array of the same size by adding spaces on the left.
// :: [string] -> [string]
const equalSize = function(strs) {
  const length = maxLength(strs);
  const _results = [];
  const _len = strs.length;
  for (let _i = 0; _i < _len; _i++) {
    let str = strs[_i];
    _results.push(fillLeft(str, length));
  }
  return _results;
};

// Returns true if one of the arrays in the given array is not empty.
// [[*]] -> boolean
const hasData = function(arrays) {
  const _len = arrays.length;
  for (let _i = 0; _i < _len; _i++) {
    let array = arrays[_i];
    if (array.length > 0) {
      return true;
    }
  }
  return false;
};

// Returns array which contains the given number of empty arrays.
// :: number -> [[]]
const initData = function(n) {
  const results = [];
  for (let i = 0; i < n; i += 1) {
    results.push([]);
  }
  return results;
};

// Appends the strings of the second argument to  the string lists of the first argument. Both arguments are assumed to
// have the same length.
// :: ([[string]], [string]) -> [[string]]
const appendStrs = function(strs0, strs1) {
  const _results = [];
  const _len = strs0.length;
  for (let i = 0; i < _len; i += 1) {
    let str0 = strs0[i];
    _results.push(str0.concat(strs1[i]));
  }
  return _results;
};

// Returns true if the given substring is contained in the given string.
// :: (string, string) -> boolean
const strContains = function(str, sub) {
  return str.indexOf(sub) !== -1;
};

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

let util = {
  // Collect all outputs of the given observables until all are ended and call the given callback with the result
  // converted to string for better readability.
  // :: (Observable<T>..., (string ->)) ->
  dataOf: function() {
    var activeCount, callback, i, n, next, observable, observables, results, resultsNow, _fn, _i, _j, _len;
    observables = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []);
    callback = arguments[_i++];
    n = observables.length; // Number of observables
    results = function() { // List of results for each observable in the same order as in the inputs
      var _j, _results;
      _results = [];
      for (i = _j = 0; 0 <= n ? _j < n : _j > n; i = 0 <= n ? ++_j : --_j) {
        _results.push(['[']);
      }
      return _results;
    }();
    // List of all values/errors in the order of the occurrence. Same index of the lists imply occurrence in the same
    // stack. Stacks with no error/value will be dropped in the lists.
    resultsNow = initData(n); // :: [[string]]
    // Number of the given observables which are not ended
    activeCount = n;
    next = function() { // To be called at the start of a new stack
      var result;
      if (hasData(resultsNow)) {
        // Join event strings for each observable and make all strings the same length. Append to result list
        results = appendStrs(results, equalSize(function() {
          const _results = [];
          const _len = resultsNow.length;
          for (let _j = 0; _j < _len; _j++) {
            result = resultsNow[_j];
            _results.push(result.join(','));
          }
          return _results;
        }()));
        resultsNow = initData(n); // Reset var to collect next stacks values/errors
      }
    };
    O.onNext(next);
    _fn = function(i) {
      observable.forEach(function(value) { // On value
        resultsNow[i].push(verifyStrValue('' + value));
      }, function(error) { // On error
        resultsNow[i].push('!' + verifyStrValue('' + error));
      }, function() { // On end
        resultsNow[i].push(']');
        activeCount -= 1;
        if (activeCount === 0) {
          next(); // Make sure all values/errors are collected in the result list
          callback(makeResultString(results));
        }
      });
    };
    _len = observables.length;
    for (i = _j = 0; _j < _len; i = ++_j) {
      observable = observables[i];
      _fn(i);
    }
  },

  // Returns an observable which emits all elements of the given array.
  // :: [*] -> Observable
  Observable: function(str) {
    var events;
    events = str.split(' ');
    return O(function(push, next) {
      var nextGroup;
      nextGroup = function() {
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
      var foo = function() {
        next(function() {
          return next(nextGroup);
        });
      };
      next(nextGroup);
    });
  },
  async: function(fn) {
    return setTimeout(fn, 1);
  },
  counter: function() {
    var count;
    count = 0;
    return function() {
      return count++;
    };
  }
};

export default util;
