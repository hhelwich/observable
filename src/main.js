import text from './another';

console.log(text);

export default 'bar';

if (typeof window !== 'undefined') {
  window.myApp = { foo: 42 } ;
}
