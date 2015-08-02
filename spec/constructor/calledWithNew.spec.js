export default () => {

  it('is compatible with ‘new’', done => {
    const observables = {
      noArg: new O(),
      array: new O([42]),
      fn: new O((push, end) => {
        push(11, 12);
        end(13);
      })
    };
    observe(observables, observed => {
      expect(observed).toEqual({
        array: [ , 42 ],
        fn:    [ ,   , , 11   ],
        time:  [ ,   , , 12, 13 ]
      });
      done();
    });
  });

};
