const onEnd = function(callback) {
  createObservable((_, __, observe) => {
    observe(this, identity, callback);
  });
  return this;
};
