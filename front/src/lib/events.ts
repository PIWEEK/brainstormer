import { v4 as uuid } from 'uuid';
import { goto } from '$app/navigation';
import { empty, concat, of, from } from "rxjs";
import * as rx from "rxjs/operators"

import type { Bus } from "$store";
import type { State, Idea } from "$state";
import { selectedIdeas } from "$state";

import { StoreEvent } from "$store";
import api from "$lib/api";

export class LoadIdeas extends StoreEvent<State> {
  constructor(
    private sessionId: string,
    private targetListIndex: number,
    private ideas: Idea[]
  ) {
    super();
  }

  update(state: State) {
    const current = state.sessions[this.sessionId].lists[this.targetListIndex];
    current.state = "Loaded";
    current.ideas = current.ideas.concat(this.ideas);
  }
}

export class CreateSession extends StoreEvent<State> {
  private id: string = "" + uuid();

  constructor(private search: string) {
    super();
  }

  update(state: State) {
    state.selected = new Set();
    state.currentSession = this.id;
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

    if (id && session && topic){
      return from(api.fakeSearch(topic, selectedIdeas(state))).pipe(
        rx.map(data => new LoadIdeas(id, this.indexList + 1, data))
      );
    } else {
      return empty();
    }
  }
}

export class MoreList extends StoreEvent<State> {
  constructor(
    private indexList: number
  ) {
    super();
  }

  update(state: State) {
    const id = state.currentSession;

    if (id) {
      state.sessions[id].lists[this.indexList].state = "MoreLoading";
    }
  }
  
  watch(state: State, events: Bus<State>): Bus<State> {
    const id = state.currentSession;
    const session = id ? state.sessions[id] : undefined;
    const topic = session?.topic;

    if (id && session && topic){
      const current = session.lists[this.indexList].ideas;

      return from(api.fakeSearchMore(topic, current, selectedIdeas(state))).pipe(
        rx.map(data => new LoadIdeas(id, this.indexList, data))
      );
    } else {
      return empty();
    }
  }
}

export class RetrieveSummary extends StoreEvent<State> {
  constructor(private sessionId: string) {
    super();
  }

  watch(state: State, events: Bus<State>): Bus<State> {
    goto("/session/" + this.sessionId + "/summary");

    const id = this.sessionId;
    const session = state.sessions[id];
    const topic = session?.topic;

    if (session && topic){
      return concat(
        of((state: State) => {
          const session = state.sessions[id];
          if (session) {
            session.summary = { state: 'Loading' }
          }
          
        }),
        from(api.fakeSummary(topic, selectedIdeas(state))).pipe(
          rx.map((data: string) => (state: State) => {
            const summary = state.sessions[id]?.summary;
            if (summary) {
              summary.state = "Loaded";
              summary.data = data;
            }
          })
        )
      );
    } else {
      return empty();
    }
  }
}
