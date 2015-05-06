

// ((A -> B), Observable<A>) -> Observable<B>
const map = curryObs(1, (obs, fn, seed) => {
  const ob0 = new Obs();
  const id = ob0._id;
  const _trigger = trigger(id);
  const _triggerError = triggerError(id);
  const deregister = addListener(obs, value => {
    async(() => {
      try {
        _trigger(fn(value));
      } catch (e) {
        _triggerError(e);
      }
    });
  }, e => {
    async(() => {
      _triggerError(e);
    });
  }, () => {
    deregister();
    async(triggerEnd(id));
  });
  return ob0;
});

const take = (count, obs) => {
  const ob = new Obs();
  const id = ob._id;
  const _trigger = trigger(id);
  const _triggerError = triggerError(id);
  let i = 0; // Number of taken values
  const deregister = addListener(obs, value => {
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
  }, e => {
    async(() => {
      _triggerError(e);
    });
  }, () => {
    deregister();
    async(triggerEnd(id));
  });
  return ob;
};

const filter = curryObs(1, (obs, predicate) => {
  const ob0 = new Obs();
  const id = ob0._id;
  const _trigger = trigger(id);
  const _triggerError = triggerError(id);
  const len = predicate.length;
  const elements = [];
  const deregister = addListener(obs, value => {
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
  }, e => {
    async(() => {
      _triggerError(e);
    });
  }, () => {
    deregister();
    async(triggerEnd(id));
  });
  return ob0;
});

const log = (prefix, obs) => {
  addListener(this, value => {
    log(prefix, value);
  }, e => {
    error(prefix, e);
  }, () => {
    log(prefix, '<end>');
  });
  return obs;
};
