import { browser } from '$app/environment';
import { getContext, setContext } from "svelte";
import { Observable, Subject, EMPTY, concat, of } from "rxjs";
import {empty} from "rxjs";
import * as rx from "rxjs/operators";
import {produce, enableMapSet} from "immer";

enableMapSet();

const STORE_CONTEXT_KEY = "store";

export type UpdateStateFn<State> = (st: State) => void;
export type Event<State> = StoreEvent<State> | UpdateStateFn<State>;
export type Bus<State> = Observable<Event<State>>;

export abstract class StoreEvent<State> {
  update(_state: State): void {}

  watch(_state: State, _events: Bus<State>): Bus<State> {
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
  private event$ = new Subject<Event<State>>();

  constructor(initialState: State) {
    this.state$ = concat(
      of(initialState),
      this.event$.pipe(
        rx.tap(e => {
          if (!browser) return;
          const debugEvents = (window as any).events;
          if (!debugEvents) {
            (window as any).events = [e]
          } else {
            debugEvents.push(e);
          }
        }),
        rx.scan((state, event) => {
          let fn: UpdateStateFn<State>;
          if (event instanceof Function) {
            fn = event;
          } else {
            fn = event.update.bind(event);
          }
          return produce(state, fn);
        }, initialState),
        rx.tap((state) => {
          if (browser) {
            (window as any).state = state
          }
        }),
        rx.catchError((err) => {
          console.error("Error", err);
          return this.state$;
        }),
        rx.shareReplay(1)
      )
    );

    const watch$: Bus<State> = this.event$.pipe(
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
  if (!getContext(STORE_CONTEXT_KEY)) {
    const store = new Store(initialState)
    setContext(STORE_CONTEXT_KEY, store);
    return store;
  } else {
    return getContext(STORE_CONTEXT_KEY);
  }
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
