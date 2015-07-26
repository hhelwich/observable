import errors from './errors';

// Returns `true` if the given array is not empty and at least one element is not `undefined`.
// hasContent :: any[] -> boolean
const hasContent = R.reduce((hasContent, value) => hasContent || value !== undefined, false);

// Remove all array indices for `undefined` values (besides the last element).
// removeUndefined :: any[] -> any[]
const removeUndefined = array => {
  const result = [];
  array.forEach((value, index) => {
    if (value !== undefined || index === array.length - 1) {
      result[index] = value;
    }
  });
  return result;
};

// Removes all empty observations and also undefined values from observations.
// removeEmptyAndUndefined :: {}<any[]> -> {}<any[]>
const removeEmptyAndUndefined = R.compose(R.mapObj(removeUndefined), R.pickBy(hasContent));

// Create on value handler function for an Observable with the given name. Add each value to the value event list for
// this Observable and add `undefined` to the value event lists of all other Observables.
// Also assure that the observed value is never undefined.
// addValue :: {}<any[]> -> string -> any -> void
const addValue = (observing, name) => value => {
  expect(value).not.toBe(undefined);
  Object.keys(observing).forEach(oname => {
    observing[oname].push(oname === name ? value : undefined);
  });
};

// Can be used to set trailing undefined value in observable test results.
global.undef = undefined;

// The name of the global error stream in the test results.
const errorsName = 'errors';

// Collects all events emitted by the given observables until all observables are ended. Calls the given callback
// with the result.
// observe :: {}<Observable<any>> -> ({}<any[]> -> void) -> void
global.observe = (observables, callback) => {
  // All value events for ended Observables.
  const observed = {}; // {}<any[]>
  // Collect all value events for all active Observables here.
  const observing = {}; // {}<any[]>
  observing[errorsName] = [];
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
        // Move key/value
        observed[name] = observing[name];
        delete observing[name];
        // If all observables are done
        if (Object.keys(observing).length === 1) {
          observed[errorsName] = observing[errorsName];
          callback(removeEmptyAndUndefined(observed));
          callback = null; // Make sure callback is only called once
        } else {
          Object.keys(observing).forEach(oname => {
            observing[oname].push(undefined);
          });
        }
      });
  });
};
