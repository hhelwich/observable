// Never ending Observable of uncaught errors.
export default O(push => {
  // Register global handler to collect uncaught errors.
  window.onerror = (msg, url, line, col, error) => {
    push(error);
  };
});
