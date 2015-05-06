// Function composition
const compose = function() {
  const fns = toArray(arguments);
  return function() {
    let result = (fns.pop()).apply(null, arguments);
    for (let i = fns.length - 1; i >= 0; i -= 1) {
      result = fns[i](result);
    }
    return result;
  };
};

// Returns a sequence generator function.
// :: -> -> number
const createSequence = () => {
  let counter = 0;
  return () => counter++;
};

// Call the given function if enough arguments are given, otherwise return function which waits for more arguments.
// :: (->, [*]) -> *
const waitForArgs = (fn, args) => {
  if (args.length >= fn.length) {
    return fn.apply(null, args);
  } else {
    return function() {
      return waitForArgs(fn, args.concat(toArray(arguments)));
    };
  }
};

// Function currying
const curry = fn => function() {
  return waitForArgs(fn, toArray(arguments));
};
