// Some array helper functions

// Alias array prototype functions
const { slice } = Array.prototype;

// Shallow copy an array or an arguments object to a new array.
// Array|Arguments -> Array
const cloneArray = arrayOrArguments => slice.call(arrayOrArguments);
