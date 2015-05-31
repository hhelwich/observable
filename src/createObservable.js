let id = 0;

// :: [T] -> Observable<T>
// :: ( -> ) -> Observable<T>
const createObservable = create => {
  const observable = new Observable();
  observable._ = {
    c: 0,  // Count of emitted values
    v: [], // Registered value listeners
    e: []  // Registered end listeners
  };
  observable.id = id++; // For debugging
  // If no function argument => assume array => creat observable from array
  if (!isFunction(create)) {
    return fromArray(create);
  }
  // ‘create’ is a function
  // Create callbacks to pass to ‘create’
  let ended = false;
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
      }
    }, delay);
  };
  const observe = (observable, onValue, onEnd) => {
    const _onValue = (value, index) => {
      const next = onValue(value, index);
      if (!isUndefined(next)) {
        push(next);
      }
    }
    const _onEnd = size => {
      const next = onEnd(size);
      if (!isUndefined(next)) {
        push(next);
      }
    };
    _addListener(observable, _onValue, _onEnd);
  };
  // Call ‘create’ with constructed callbacks
  try {
    const register = create(push, end, observe);
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
const _addListener = (observable, onValue, onEnd) => {
  observable._.v.push(onValue);
  observable._.e.push(onEnd);
};

// Emit the given value (assumed not undefined) on the observable (assumed active).
const _emitValue = (observable, value) => {
  observable._.v.forEach(callback => {
    callback(value, observable._.c);
  });
  observable._.c += 1;
};

// End the given observable (assumed active).
const _emitEnd = observable => {
  observable._.e.forEach(callback => {
    callback(observable._.c);
  });
  // Free references for GC
  delete observable._;
};
