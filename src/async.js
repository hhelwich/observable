// JS queue utils

const _postMessage = postMessage;
const _setTimeout = setTimeout;

const _timeouts = [];
const _messageName = '_0653rv4613_';

global.addEventListener('message', event => {
  if (event.source === global && event.data === _messageName) {
    event.stopPropagation();
    if (_timeouts.length > 0) {
      _timeouts.shift()();
    }
  }
}, true);

// Add the given function to the JS queue.
// :: (->) ->
let async = (fn, delay) => {
  if (delay == null || delay === 0) {
    _timeouts.push(fn);
    _postMessage(_messageName, '*');
  } else {
    _setTimeout(fn, delay);
  }
};

if (typeof RELEASE === 'undefined' || !RELEASE) {
  global._setAsync = createNewAsync => {
    async = createNewAsync(async);
  };
}
