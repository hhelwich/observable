import calledWithNew from './calledWithNew.spec';
import calledWithNoArgs from './calledWithNoArgs.spec';
import calledWithArray from './calledWithArray.spec';
import calledWithFunction from './calledWithFunction/index.spec';

export default () => {

  describe('The Observable constructor ‘O()’', () => {

    calledWithNew();
    calledWithNoArgs();
    calledWithArray();
    calledWithFunction();

  });

};
