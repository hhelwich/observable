const fromArray = array => createObservable((push, end) => {
  array.forEach(value => { push(value); });
  end();
});
