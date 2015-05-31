let id = 0;

// :: [T] -> Observable<T>
// :: ( -> ) -> Observable<T>
const createObservable = create => {
  const observable = new Observable();
  observable._ = {
    c: 0,  // Count of emitted values
    l: []  // Registered value/end listeners
  };
  observable.id = id++; // For debugging
  // If no function argument => assume array => creat observable from array
  if (!isFunction(create)) {
    return fromArray(create);
  }
  // ‘create’ is a function
  // Create callbacks to pass to ‘create’
  let ended = false;
  let sources = [];
  const push = (value, delay) => {
    // Ignore undefined values
    if (!isUndefined(value)) {
      async(() => {
        if (!ended) {
          _emitValue(observable, value);
        }
      }, delay);
    }
  };
  const end = delay => {
    async(() => {
      if (!ended) {
        ended = true;
        _emitEnd(observable);
        // Deregister on source observables
        sources.forEach(source => {
          _removeListener(source[0], source[1]);
        });
        // Free references for GC
        delete observable._;
        sources = null;
      }
    }, delay);
  };
  const observe = (source, onValue, onEnd) => {
    const listener = [
      // value listener
      (value, index) => {
        const next = onValue(value, index);
        if (!isUndefined(next)) {
          push(next);
        }
      },
      // end listener
      size => {
        const next = onEnd(size);
        if (!isUndefined(next)) {
          push(next);
        }
      }
    ];
    // Remember source observable so we can deregister when this observable ends
    sources.push([source, listener]);
    // Add value/end listener to source
    _addListener(source, listener);
  };
  // Call ‘create’ with constructed callbacks and store optional register function
  try {
    observable._.r = create(push, end, observe);
  } catch (e) {
    // ‘create’ throws => pipe to global error stream
    pushError(e);
  }
  // Return created observable
  return observable;
};

// Set observable prototype so instanceof works on exported function
createObservable.prototype = ObservableProto;

// Add value and end listeners to the given observable (assumed active).
const _addListener = (observable, listener) => {
  const listeners = observable._.l;
  // If listeners go from 0 to 1 => call register function and remember optional unregister function
  if (listeners.length === 0) {
    const register = observable._.r;
    if (isFunction(register)) {
      register.u = register();
    }
  }
  // Remember listeners
  listeners.push(listener);
};

// Remove the given listener from the observable
const _removeListener = (observable, listener) => {
  // If observable is still active remove listener
  if (!isUndefined(observable._)) {
    const listeners = observable._.l;
    const index = listeners.indexOf(listener);
    listeners.splice(index, 1);
    const register = observable._.r;
    if (listeners.length === 0 && isFunction(register) && isFunction(register.u)) {
      register.u();
    }
  }
};

// Emit the given value (assumed not undefined) on the observable (assumed active).
const _emitValue = (observable, value) => {
  observable._.l.forEach(callbacks => {
    callbacks[0](value, observable._.c);
  });
  observable._.c += 1;
};

// End the given observable (assumed active).
const _emitEnd = observable => {
  observable._.l.forEach(callbacks => {
    callbacks[1](observable._.c);
  });
};
