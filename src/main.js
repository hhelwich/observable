import text from './another';

export default 'bar';

(() => { return typeof window !== 'undefined' ? window : global; })().myApp = { foo: 42 };
