
// Prototype for all Observables.
const obsProto = Obs.prototype = {
  log(prefix) {
    return globals.log(prefix, this);
  },
  forEach(onValue, onError, onEnd) {
    return addListener(this, onValue, onError, onEnd);
  },
  map(fn) {
    return globals.map(fn, this);
  },
  filter(predicate) {
    return globals.filter(predicate, this);
  },
  take(count) {
    return globals.take(count, this);
  }
};

// Constructor function for a new Observable. It should be used without `new`.
const Observable = creator => pushValues(new Obs(), creator);

Observable.prototype = obsProto; // For instanceof

// Will be called at the start of each queue message created by this type
// :: (->) ->
Observable.onNext = callback => {
  onNext = callback;
};

// Returns an observable which emits all elements of the given array.
// :: [*] -> Observable
const fromArray = array => {
  array = array.slice(0); // Shallow copy array
  return Observable((push, next) => {
    var pushNext;
    const pushIfAvailable = () => {
      if (array.length > 0) {
        next(pushNext);
      }
    };
    pushNext = () => {
      push(array.shift());
      pushIfAvailable();
    };
    pushIfAvailable();
  });
};

const once = value => fromArray([value]);

const globals = {
  map, take, filter, log, fromArray, once
};

// Copy all global functions to the exported object.
iterate(globals, (name, fn) => {
  Observable[name] = fn;
});
