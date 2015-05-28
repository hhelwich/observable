interface Observable<T> {
  map<U>(fn: (value: T) => U): Observable<U>;
  filter(predicate: (value: T) => boolean): Observable<T>;
  merge<U>(observable: Observable<U>): Observable<T|U>;
  concat<U>(observable: Observable<U>): Observable<T|U>;
  first(): Observable<T>;
  last(): Observable<T>;
  skip(count: number): Observable<T>;
}

interface ObservableStatic {
  <T>(creator: (
      push: (value: T, delay?: number) => void,
      end: (delay?: number) => void,
      observe: <U>(
        observable: Observable<U>,
        onValue: (value: U, index: number) => T|void,
        onEnd: (size: number) => void
      ) => void
    ) => void|(() => void|(() => void))): Observable<T>;
}

declare var O: ObservableStatic;
