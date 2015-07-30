// Virtual time in milliseconds.
// currentTime :: number
let currentTime = 0;

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

// Mock the `async` function to verify timing in tests.
_setAsync(async => (fn, time = 0) => {
  addFunction(fn, time);
  async(handleNextTimeout, 0);
});
