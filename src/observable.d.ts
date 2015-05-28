interface Observable<V, E> {
  map<W>(fn: (value: V) => W): Observable<W, E>;
  mapError<F>(fn: (error: E) => F): Observable<V, F>;
  filter(predicate: (value: V) => boolean): Observable<V, E>;
  filterError(predicate: (value: E) => boolean): Observable<V, E>;
  merge<W, F>(observable: Observable<W, F>): Observable<V|W, E|F>;
  concat<W, F>(observable: Observable<W, F>): Observable<V|W, E|F>;
  first(): Observable<V, E>;
  last(): Observable<V, E>;
  skip(count: number): Observable<V, E>;
}

interface ObservableStatic {
  <V, E>(creator: (
      push: (value: V, delay?: number) => void,
      pushError: (error: E, delay?: number) => void,
      end: (delay?: number) => void,
      process: <W, F>(
        observable: Observable<W, F>,
        onValue: (value: W, valueIndex: number, index: number) => V|void,
        onError: (error: F, errorIndex: number, index: number) => E|void,
        onEnd: (size: number) => void
      ) => void
    ) => void|(() => void|(() => void))): Observable<V, E>;
}

declare var O: ObservableStatic;
