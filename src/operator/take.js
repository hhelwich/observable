const take = (count, source) => createObservable((_, end, observe) => {
  observe(
    source,
    (value, index) => {
      // End asynchronously if last value
      if (index + 1 === count) {
        end();
      }
      return value;
    },
    () => { end(); }
  );
});
