// JS queue utils

// Add the given function to the JS queue.
// :: (->) ->
let async = (f, delay) => {
  setTimeout(f, delay);
};

if (typeof RELEASE === 'undefined' || !RELEASE) {
  global._setAsync = createNewAsync => {
    async = createNewAsync(async);
  }
}
