import { getContext, setContext } from "svelte";
import { Observable, Subject, EMPTY, concat, of } from "rxjs";
import {empty} from "rxjs";
import * as rx from "rxjs/operators";
import {produce} from "immer";

const STORE_CONTEXT_KEY = "store";

type UpdateStateFn<State> = (st: State) => void;
type Event<State> = StoreEvent<State> | UpdateStateFn<State>;

export abstract class StoreEvent<State> {
  update(_state: State): void {}

  watch(_state: State, _events: Observable<Event<State>>) {
    return EMPTY;
  }
}

interface IStore<State> {
  emit(event: Event<State>): void;
  select<T>(selector: (st: State) => T): Observable<T>;
}

/*
  Main class for state management. 
 */
export class Store<State> implements IStore<State>{
  // 
  private state$: Observable<State>;

  private event$ = new Subject<StoreEvent<State> | UpdateStateFn<State>>();

  constructor(initialState: State) {
    this.state$ = concat(
      of(initialState),
      this.event$.pipe(
        // rx.tap(x => console.log(x)),
        rx.scan((state, event) => {
          let fn: UpdateStateFn<State>;
          if (event instanceof Function) {
            fn = event;
          } else {
            fn = event.update.bind(event);
          }
          //console.log("proc", fn);
          return produce(state, fn);
        }, initialState),
        rx.tap(x => console.log(x)),
        rx.tap((state) => (window as any).state = state),
        rx.catchError((err) => {
          console.error("Error", err);
          return this.state$;
        }),
        rx.shareReplay(1)
      )
    );

    const watch$: Observable<StoreEvent<State>> = this.event$.pipe(
      rx.withLatestFrom(this.state$),
      rx.mergeMap(([e, state]) => {
        if (!(e instanceof Function)) {
          return e.watch(state, this.event$)
        } else {
          return empty();
        }
      }),
      rx.catchError((err) => {
        console.error("Error", err);
        return watch$;
      })
    );

    watch$.subscribe(this.event$);
  }

  get state(): Observable<State> {
    return this.state$;
  }

  // Send a new event to the event bus
  emit(event: Event<State>) {
    this.event$.next(event);
  }

  // Retrieves a stream with the values
  select<T>(selector: (st: State) => T): Observable<T> {
    return this.state$.pipe(
      rx.map(selector),
      rx.distinctUntilChanged()
    );
  }
}

export function start<State>(initialState: State): Store<State> {
  const store = new Store(initialState)
  setContext(STORE_CONTEXT_KEY, store);
  return store;
}

export function get<State>(): Store<State> {
  return getContext(STORE_CONTEXT_KEY);
}

export default {
  StoreEvent,
  Store,
  start,
  get
};
