
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
const curryObs = (n, fn) => waitForObs(fn, [], n);

// Unique id generator function for listeners. It would be possible to have a listener id generator per observable but
// then it would be needed to store the generator in the observable itself (for GC) so we make a global generator here
// instead.
// :: -> number
const listenerId = createSequence();

// All active listeners to all active observables are stored here.
// :: string -> string -> { onValue: ->, onError: ->, onEnd: -> }
const obsListeners = {};

// Add a new listener function for an existing observable.
// Returns a function to deregister the listener.
// :: (Observable, (T ->), (* ->), (->)) ->
const addListener = (obs, onValue, onError, onEnd) => {
  var deregister;
  // Get listeners of observable
  let listeners = obsListeners[obs._id];
  if (listeners == null) {
    obsListeners[obs._id] = listeners = {};
    if (obs._reg != null) {
      deregister = obs._reg.call(obs);
    }
  }
  // Add new listener
  const lid = listenerId();
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

const removeListener = (obs, lid) => {};

// Emit the given value on the observable with the given id.
// :: string -> * ->
const trigger = curry((oid, value) => {
  if (value !== undefined) {
    iterate(obsListeners[oid], (_, listener) => {
      listener.onValue(value);
    });
  }
});

// Emit the given error object on the observable with the given id.
// :: string -> * ->
const triggerError = curry((oid, error) => {
  iterate(obsListeners[oid], (_, listener) => {
    listener.onError(error);
  });
});

// End the observable with the given id.
// :: string -> ->
const triggerEnd = oid => () => {
  iterate(obsListeners[oid], (_, listener) => {
    listener.onEnd();
  });
};

// Calls the given function with a push function to emit values on the given observable.
// (Observable, (->)) -> Observable
const pushValues = (obs, create) => {
  let register = null;
  const id = obs._id;
  let msgCount = 0; // How much messages are in the queue for this observable
  const checkEnd = () => {
    if (register == null && msgCount === 0) { // No more messages in queue => end observable
      async(triggerEnd(id));
    }
  };
  const next = fn => {
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
