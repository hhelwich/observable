// All uncought errors will be collected here. Newer errors have higher indices.
let _errors = [];

// Register global handler to collect uncought errors.
window.onerror = (msg, url, line, col, error) => {
  _errors.push(error);
};

// Return all global errors since startup or after the last call.
export default () => {
  const errors = _errors;
  _errors = [];
  return errors;
};
