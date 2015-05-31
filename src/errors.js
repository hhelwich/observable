const pushError = error => {
  _pushError(error);
  async(() => {
    throw error;
  });
};

let _pushError;

const errors = createObservable(push => {
  _pushError = push;
});
