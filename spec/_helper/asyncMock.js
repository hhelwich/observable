// Virtual time in milliseconds.
// currentTime :: number
let currentTime = 0;

// Count the JavaScript stacks created by the library.
// stackCount :: number
let stackCount = 0;

// Functions to call asynchronously later at the absolute time stored in the keys.
// fns :: {}<(any -> any)[]>
const fns = {};

// Remove the first function with the given time string key from the static function map and return it.
// removeFn :: timeStr -> any -> any
const removeFn = timeStr => {
  const fnsAtTime = fns[timeStr];
  const fn = fnsAtTime.shift();
  if (fnsAtTime.length === 0) {
    delete fns[timeStr];
  }
  return fn;
};

// Get the lowest time string key from the static function map.
// getNextTimeStr :: {}<(any -> any)[]> -> string
const getNextTimeStr = R.compose(R.head, R.sort((a, b) => (+a) - (+b)), R.keys);

// Call the function with the lowest time.
// handleNextTimeout :: void -> void
const handleNextTimeout = () => {
  stackCount += 1;
  const nextTimeStr = getNextTimeStr(fns);
  const nextFn = removeFn(nextTimeStr);
  currentTime = +nextTimeStr;
  nextFn();
};

// Remember the given function and its associated time interval in the static function map.
// addFunction :: (any -> any) -> number -> void
const addFunction = (fn, time) => {
  const timeKey = '' + (time + currentTime);
  let fnsAtTime = fns[timeKey];
  if (fnsAtTime == null) {
    fnsAtTime = fns[timeKey] = [];
  }
  fnsAtTime.push(fn);
};

// The original async function used in the library.
// async :: (any -> any) -> number -> void
let async;

// The mock async function which records the intervals for testing and also sets the real interval to `0`.
// asyncMock :: (any -> any) -> number -> void
const asyncMock = (fn, time = 0) => {
  addFunction(fn, time);
  async(handleNextTimeout, 0);
};

// Put the mock function in a global variable so it can also be used in tests.
global._setTimeout = asyncMock;

// Get the original async function and replace it with the mock async function.
_setAsync(_async => {
  async = _async;
  return asyncMock;
});

export default {
  getTime() {
    return currentTime;
  },
  getStackCount() {
    return stackCount;
  }
};
