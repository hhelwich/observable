describe('setTimeout', () => {

  it('respects call order if delay time is equal', done => {
    const count = 500;
    let k = 0;
    for (let i = 0; i < count; i += 1) {
      (j => {
        setTimeout(() => {
          expect(j).toBe(k);
          k += 1;
          if (k === count) {
            done();
          }
        }, 0);
      })(i);
    }
  });

});
