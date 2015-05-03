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

// Observable unique id generator function.
// :: -> number
const observableId = createSequence();

// Internal Observable constructor function
// :: (->) -> Obs<T>
const Obs = function() {
  this._id = observableId();
};

// Returns true if the given value is an observable
// :: * -> boolean
const isObservable = obs => obs instanceof Obs;

// Call the given function if the last `n` elements of the `args` array are instances of `Obs`, otherwise return a
// function which waits for more arguments to be appended on the current arguments.
// (->, [*], number) -> ->
const waitForObs = (fn, args, n) => {
  return function() {
    const args2 = appendArray(copyArray(args), arguments);
    const len = args2.length;
    for (let i = n; i >= 1; i -= 1) {
      if (!isObservable(args2[len - i])) {
        return waitForObs(fn, args2, n);
      }
    }
    // The last n arguments are Observables => call function but move Observables from tail to head
    for (let i = 0; i < n; i += 1) {
      args2.unshift(args2.pop());
    }
    return fn.apply(null, args2);
  };
};

// Return a function which calls the given function if its last `n` arguments are instances of Obs, otherwise return a
// function which waits for more arguments to be appended on the given arguments.
let curryObs = (n, fn) => {
  return waitForObs(fn, [], n);
};

// Call the given function if enough arguments are given, otherwise return function which waits for more arguments.
// :: (->, [*]) -> *
let waitForArgs = (fn, args) => {
  if (args.length >= fn.length) {
    return fn.apply(null, args);
  } else {
    return function() {
      return waitForArgs(fn, args.concat(toArray(arguments)));
    };
  }
};

// Function currying
let curry = (fn) => {
  return function() {
    return waitForArgs(fn, toArray(arguments));
  };
};

// Unique id generator function for listeners. It would be possible to have a listener id generator per observable but
// then it would be needed to store the generator in the observable itself (for GC) so we make a global generator here
// instead.
// :: -> number
let listenerId = createSequence();

// All active listeners to all active observables are stored here.
// :: string -> string -> { onValue: ->, onError: ->, onEnd: -> }
let obsListeners = {};

// Add a new listener function for an existing observable.
// Returns a function to deregister the listener.
// :: (Observable, (T ->), (* ->), (->)) ->
let addListener = (obs, onValue, onError, onEnd) => {
  let deregister;
  // Get listeners of observable
  let listeners = obsListeners[obs._id];
  if (listeners == null) {
    obsListeners[obs._id] = listeners = {};
    if (obs._reg != null) {
      deregister = obs._reg.call(obs);
    }
  }
  // Add new listener
  let lid = listenerId();
  listeners[lid] = {
    onValue: toFunc(onValue),
    onError: toFunc(onError),
    onEnd: toFunc(onEnd)
  };
  // Return deregister function
  return () => {
    delete listeners[lid];
    if (isEmpty(listeners)) {
      delete obsListeners[obs._id];
      if (deregister != null) {
        deregister.call(obs);
        deregister = null;
      }
    }
  };
};

let removeListener = (obs, lid) => {};

// Iterate key/value pairs of an object
// :: ((string -> *), ((string, *) ->)) ->
let iterate = (obj, callback) => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      callback(key, obj[key]);
    }
  }
};

// Emit the given value on the observable with the given id.
// :: string -> * ->
let trigger = curry((oid, value) => {
  if (value !== void 0) {
    iterate(obsListeners[oid], (_, listener) => {
      listener.onValue(value);
    });
  }
});

// Emit the given error object on the observable with the given id.
// :: string -> * ->
let triggerError = curry((oid, error) => {
  iterate(obsListeners[oid], (_, listener) => {
    listener.onError(error);
  });
});

// End the observable with the given id.
// :: string -> ->
let triggerEnd = (oid) => {
  return () => {
    iterate(obsListeners[oid], (_, listener) => {
      listener.onEnd();
    });
  };
};

// Calls the given function with a push function to emit values on the given observable.
// (Observable, (->)) -> Observable
let pushValues = (obs, create) => {
  let register = null;
  let id = obs._id;
  let msgCount = 0; // How much messages are in the queue for this observable
  let checkEnd = () => {
    if (register == null && msgCount === 0) { // No more messages in queue => end observable
      async(triggerEnd(id));
    }
  };
  let next = (fn) => {
    async(() => {
      try {
        fn.call(obs);
      } catch (e) {
        triggerError(id)(e);
      }
      msgCount -= 1;
      checkEnd();
    });
    msgCount += 1;
  };
  register = create.call(obs, trigger(id), next);
  checkEnd();
  if (register != null) {
    obs._reg = register;
  }
  return obs;
};

let globals = {
  // ((A -> B), Observable<A>) -> Observable<B>
  map: curryObs(1, (obs, fn, seed) => {
    let ob0 = new Obs();
    let id = ob0._id;
    let _trigger = trigger(id);
    let _triggerError = triggerError(id);
    let deregister = addListener(obs, (value) => {
      async(() => {
        try {
          _trigger(fn(value));
        } catch (e) {
          _triggerError(e);
        }
      });
    }, (e) => {
      async(() => {
        _triggerError(e);
      });
    }, () => {
      deregister();
      async(triggerEnd(id));
    });
    return ob0;
  }),
  take: (count, obs) => {
    let ob = new Obs();
    let id = ob._id;
    let _trigger = trigger(id);
    let _triggerError = triggerError(id);
    let i = 0; // Number of taken values
    let deregister = addListener(obs, (value) => {
      if (i < count) {
        async(() => {
          _trigger(value);
        });
      }
      i += 1;
      if (i >= count) {
        deregister();
        async(triggerEnd(id));
      }
    }, (e) => {
      async(() => {
        _triggerError(e);
      });
    }, () => {
      deregister();
      async(triggerEnd(id));
    });
    return ob;
  },
  filter: curryObs(1, (obs, predicate) => {
    let ob0 = new Obs();
    let id = ob0._id;
    let _trigger = trigger(id);
    let _triggerError = triggerError(id);
    let len = predicate.length;
    let elements = [];
    let deregister = addListener(obs, (value) => {
      try {
        if (isTrue(predicate(value))) {
          async(() => {
            _trigger(value);
          });
        }
      } catch (e) {
        async(() => {
          _triggerError(e);
        });
      }
    }, (e) => {
      async(() => {
        _triggerError(e);
      });
    }, () => {
      deregister();
      async(triggerEnd(id));
    });
    return ob0;
  })
};

// Prototype for all Observables.
let obsProto = Obs.prototype = {
  log: function(prefix) {
    addListener(this, (value) => {
      log(prefix, value);
    }, (e) => {
      error(prefix, e);
    }, () => {
      log(prefix, '<end>');
    });
  },
  forEach: function(onValue, onError, onEnd) {
    return addListener(this, onValue, onError, onEnd);
  },
  map: function(fn) {
    return globals.map(fn, this);
  },
  filter: function(predicate) {
    return globals.filter(predicate, this);
  },
  take: function(count) {
    return globals.take(count, this);
  }
};

// Constructor function for a new Observable. It should be used without `new`.
let Observable = (creator) => {
  return pushValues(new Obs(), creator);
};

Observable.prototype = obsProto; // For instanceof

// Will be called at the start of each queue message created by this type
// :: (->) ->
Observable.onNext = (callback) => {
  onNext = callback;
};

// Returns an observable which emits all elements of the given array.
// :: [*] -> Observable
Observable.fromArray = (array) => {
  array = array.slice(0); // Shallow copy array
  return Observable((push, next) => {
    let pushNext;
    let pushIfAvailable = () => {
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

Observable.once = (value) => {
  return Observable.fromArray([value]);
};

// Copy all global functions to the exported object.
iterate(globals, (name, fn) => {
  Observable[name] = fn;
});
