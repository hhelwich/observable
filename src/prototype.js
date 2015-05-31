const ObservableProto = {
  onValue,
  onEnd,
  take: function(count) {
    return take(count, this);
  }
};

Observable.prototype = ObservableProto;
