import errors from './errors';
import asyncMock from './asyncMock';

// The name of the global error stream in the test results.
const errorsName = 'errors';

// The name of the time in the test results.
const timesName = 'time';

// Throws if the stack counter has not changed since the last call.
// assureNewStack :: void -> void
const assureNewStack = (() => {
  let stackCount;
  return () => {
    const currentStackCount = asyncMock.getStackCount();
    if (stackCount === currentStackCount) {
      throw Error('Test Error: Different events occur in the same stack');
    }
    stackCount = currentStackCount;
  };
})();

// Throw if the given value is `undefined`.
// assureValidValue :: any -> void
const assureValidValue = value => {
  if (value === undefined) {
    throw Error('Test Error: Observable must not emit undefined value');
  }
};

// Returns `true` if the given array is not empty and at least one element is not `undefined`.
// hasContent :: any[] -> boolean
const hasContent = R.reduce((hasContent, value) => hasContent || value !== undefined, false);

// Remove all array indices for `undefined` values (besides the last element).
// removeUndefined :: any[] -> any[]
const removeUndefined = array => {
  const result = [];
  result.length = array.length;
  array.forEach((value, index) => {
    if (value !== undefined) {
      result[index] = value;
    }
  });
  return result;
};

// Replace successive equal numbers by `undefined`.
// removeTimeDups :: number[] -> number|undefined[]
const removeTimeDups = times => R.reduce((acc, time) => {
  let newTime;
  if (time !== acc.time) {
    newTime = acc.time = time;
  }
  acc.times.push(newTime);
  return acc;
}, { times: [], time: 0 }, times).times;

// Subtract a number from all numbers in a list.
// subtract :: number -> number[] -> number[]
const subtract = dec => R.map(t => t - dec);

// Removes all empty observations and also undefined values from observations.
// removeEmptyAndUndefined :: {}<any[]> -> {}<any[]>
const removeEmptyAndUndefined = R.compose(R.mapObj(removeUndefined), R.pickBy(hasContent));

// Create on value handler function for an Observable with the given name. Add each value to the value event list for
// this Observable and add `undefined` to the value event lists of all other Observables.
// Also assure that the observed value is never undefined.
// addValue :: {}<any[]> -> string -> any -> void
const addValue = (observing, name) => value => {
  assureNewStack();
  assureValidValue(value);
  Object.keys(observing).forEach(oname => {
    observing[oname].push(oname === name ? value : oname === timesName ? asyncMock.getTime() : undefined);
  });
};

// Collects all events emitted by the given observables until all observables are ended. Calls the given callback
// with the result.
// observe :: {}<Observable<any>> -> ({}<any[]> -> void) -> void
global.observe = (observables, callback) => {
  // All value events for ended Observables.
  let observed = {}; // {}<any[]>
  // Collect all value events for all active Observables here.
  const observing = {}; // {}<any[]>
  const startTime = asyncMock.getTime(); // number
  observing[errorsName] = [];
  observing[timesName] = [];
  //TODO: Unregister error listener when all observables end
  errors.onValue(addValue(observing, errorsName));
  // Iterate all observables
  Object.keys(observables).forEach(name => {
    // Get observable
    const observable = observables[name];
    if (observing[name] != null) {
      throw Error('Naming conflict');
    }
    // Initialize arrays to collect events of the current observable
    observing[name] = [];
    // Register listener to collect events
    observable
      .onValue(addValue(observing, name))
      .onEnd(() => {
        assureNewStack();
        // Move key/value
        observed[name] = observing[name];
        delete observing[name];
        observing[timesName].push(asyncMock.getTime());
        // If all observables are done
        if (Object.keys(observing).length === 2) {
          //TODO Remove columns for removed observables
          observed[errorsName] = observing[errorsName];
          observed[timesName] = removeTimeDups(subtract(startTime)(observing[timesName]));
          observed = removeEmptyAndUndefined(observed);
          callback(observed);
          callback = null; // Make sure callback is only called once
        } else {
          Object.keys(observing).filter(oname => oname !== timesName).forEach(oname => {
            observing[oname].push(undefined);
          });
        }
      });
  });
};
