import { v4 as uuid } from 'uuid';
import { goto } from '$app/navigation';
import { empty, concat, of, from } from "rxjs";
import * as rx from "rxjs/operators"

import type { Bus } from "$store";
import type { State, Idea } from "$state";

import { StoreEvent } from "$store";
import api from "$lib/api";

export class LoadIdeas extends StoreEvent<State> {
  constructor(
    private id: string,
    private listIdx: number,
    private data: Idea[]
  ) {
    super();
  }

  update(state: State) {
    const current = state.sessions[this.id].lists[this.listIdx];
    current.state = "Loaded";
    current.ideas = current.ideas.concat(this.data);
  }
}

export class CreateSession extends StoreEvent<State> {
  private id: string = "" + uuid();

  constructor(private search: string) {
    super();
  }

  update(state: State) {
    state.sessions[this.id] = {
      id: this.id,
      topic: this.search,
      lists: [{
        state: "InitialLoading",
        ideas: []
      }]
    }
  }
  
  watch(state: State, events: Bus<State>): Bus<State> {
    const session = "" + uuid();

    goto("/session/" + this.id);

    return concat(
      from(api.fakeSearch(this.search)).pipe(
        rx.map(data => new LoadIdeas(this.id, 0, data))
      )
    );
  }
}

export class SelectIdeaCard extends StoreEvent<State> {
  constructor(
    private indexList: number,
    private indexCard: number
  ) {
    super();
  }

  update(state: State) {
    const selid = this.indexList + "," + this.indexCard;

    if (!state.selected) {
      state.selected = new Set();
    }

    if (state.selected?.has(selid)) {
      return;
    }

    for (let e of state.selected) {
      if (e.startsWith(this.indexList + ",")) {
        state.selected?.delete(e);
      }
    }
    
    state.selected?.add(selid);
  }
}

export class NextList extends StoreEvent<State> {
  constructor(
    private indexList: number,
    private indexCard: number,
    private input: string
  ) {
    super();
  }

  update(state: State) {
    const id = state.currentSession;

    if (id) {
      state.sessions[id].lists.splice(this.indexList + 1);
      state.sessions[id].lists.push({
        state: "InitialLoading",
        ideas: []
      });
    }
  }
  
  watch(state: State, events: Bus<State>): Bus<State> {
    const id = state.currentSession;
    const session = id ? state.sessions[id] : undefined;
    const topic = session?.topic;

    if (id){
      // TODO!!
      const previous = [] as Idea[];

      return from(api.fakeSearch(topic, previous)).pipe(
        rx.map(data => new LoadIdeas(id, this.indexList + 1, data))
      );
    } else {
      return empty();
    }
  }
}

