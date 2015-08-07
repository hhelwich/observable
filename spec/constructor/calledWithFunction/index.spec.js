import main from './main.spec';
import source from './source.spec';
import transmit from './transmit.spec';
import register from './register.spec';

export default () => {

  describe('called with a function argument', () => {

    main();
    source();
    transmit();
    register();

  });

};
