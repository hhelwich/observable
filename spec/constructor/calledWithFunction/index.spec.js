import source from './source.spec';
import register from './register.spec';
import transmit from './transmit.spec';

export default () => {

  describe('called with a function argument', () => {

    source();
    transmit();
    //register();

  });

};
