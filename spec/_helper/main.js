import './observe';
import toBeInstanceOf from './matcher/toBeInstanceOf';

beforeEach(() => {
  jasmine.addMatchers(toBeInstanceOf);
});
