// All uncought errors will be collected here. Newer errors have higher indices.
var _errors = [];

global.errors = {
  // Clear the collected global error list.
  clear() {
    _errors = [];
  },
  // Return all global errors since startup or after the last clear() call.
  get() {
    return _errors.slice();
  }
};

// Register global handler to collect uncought errors.
window.onerror = (msg, url, line, col, error) => {
  _errors.push(error);
};
