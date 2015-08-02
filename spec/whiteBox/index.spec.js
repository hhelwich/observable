import cloneArray from './cloneArray.spec';
import isFunction from './isFunction.spec';
import isObservable from './isObservable.spec';

export default () => {

  describe('White-box test:', () => {

    cloneArray();
    isFunction();
    isObservable();
    
  });

};
