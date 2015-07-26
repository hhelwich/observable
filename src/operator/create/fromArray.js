const fromArray = array => createObservable((push, end) => {
  if (array == null) {
    array = [];
  }
  array.forEach(value => { push(value); });
  end();
});
