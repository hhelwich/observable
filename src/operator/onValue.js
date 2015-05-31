const onValue = function(callback) {
  createObservable((_, end, observe) => {
    observe(this, callback, () => { end(); });
  });
  return this;
};
