import { v4 as uuid } from 'uuid';
import { goto } from '$app/navigation';
import { empty, concat, of, from } from "rxjs";
import * as rx from "rxjs/operators"

import type { IStore, Bus } from "$store";
import type { State, Idea } from "$state";
import { selectedIdeas, hasLoadingSession } from "$state";

import { StoreEvent } from "$store";
import api from "$lib/api";

import { formatSession, parseSession } from "$lib/serializer";

export class InitSession extends StoreEvent<State> {
  constructor(
    private sessionId: string
  ) {
    super();
  }

  update(state: State) {
    const storedSession = localStorage.getItem(this.sessionId);

    if (storedSession) {
      const session = parseSession(storedSession);
      state.sessions[session.id] = session;
      state.currentSession = session.id;
    } else {
      goto("/");
      delete state.currentSession;
    }
  }
}

export class SaveSession extends StoreEvent<State> {
  constructor(
    private sessionId: string
  ) {
    super();
  }

  update(state: State) {
    const session = state.sessions[this.sessionId];

    if (session && !hasLoadingSession(session)) {
      localStorage.setItem(this.sessionId, formatSession(session));

      const recentStr = localStorage.getItem("recent-sessions");
      const recent = recentStr ? JSON.parse(recentStr) : [];

      let newRecent = [...recent].filter(i => i.id !== session.id);
      if (newRecent.length >= 5) {
        newRecent = newRecent.splice(newRecent.length - 4, 4);
      }
      newRecent.push({id: session.id, topic: session.topic});
      state.recent = newRecent;
      localStorage.setItem("recent-sessions", JSON.stringify(newRecent));
    }
  }
}


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
    state.currentSession = this.id;
    state.sessions[this.id] = {
      id: this.id,
      topic: this.search,
      selected: new Set(),
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
      from(api.search(this.search)).pipe(
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
    const id = state.currentSession;

    if (!id) return;
    
    const selid = this.indexList + "," + this.indexCard;
    const session = state.sessions[id];

    if (!session) return;

    if (!session.selected) {
      session.selected = new Set();
    }

    if (session.selected?.has(selid)) {
      return;
    }

    for (let e of session.selected) {
      if (e.startsWith(this.indexList + ",")) {
        session.selected?.delete(e);
      }
    }
    
    session.selected?.add(selid);
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
      const session = state.sessions[id];
      let listTitle = session.lists[this.indexList].ideas[this.indexCard].title

      if (this.input) {
        session.lists[this.indexList].ideas[this.indexCard].input = this.input;
        listTitle = listTitle + "(" + this.input + ")"
      }

      const indexList = this.indexList;

      if (session.selected) {
        const newSelected = [...session.selected].filter((v: string) => {
          const [listIdxStr, cardIdxStr] = v.split(",");
          const listIdx = parseInt(listIdxStr, 10);
          const cardIdx = parseInt(cardIdxStr, 10);
          return listIdx <= indexList;
        });

        session.selected = new Set(newSelected);
      }

      session.lists.splice(this.indexList + 1);
      session.lists.push({
        state: "InitialLoading",
        ideas: [],
        title: listTitle,
      });
    }
  }

  watch(state: State, events: Bus<State>): Bus<State> {
    const id = state.currentSession;
    const session = id ? state.sessions[id] : undefined;
    const topic = session?.topic;

    if (id && session && topic){
      return from(api.search(topic, selectedIdeas(state))).pipe(
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

      return from(api.searchMore(topic, current, selectedIdeas(state))).pipe(
        rx.map(data => new LoadIdeas(id, this.indexList, data))
      );
    } else {
      return empty();
    }
  }
}

export class RetrieveSummary extends StoreEvent<State> {
  constructor() {
    super();
  }

  watch(state: State, events: Bus<State>): Bus<State> {
    goto("/session/" + state.currentSession + "/summary");

    const id = state.currentSession;
    const session = id ? state.sessions[id] : null;
    const topic = session?.topic;

    if (id && session && topic){
      return concat(
        of((state: State) => {
          const session = state.sessions[id];
          if (session) {
            session.summary = { state: 'Loading' }
          }
        }),
        from(api.summary(topic, selectedIdeas(state))).pipe(
          rx.map((data: string) => new LoadSummary(data))
        )
      );
    } else {
      return empty();
    }
  }
}

export class LoadSummary extends StoreEvent<State> {
  constructor(
    private data: string
  ) {
    super();
  }

  update(state: State) {
    const id = state.currentSession;
    const summary = id && state.sessions[id]?.summary;

    if (summary) {
      summary.state = "Loaded";
      summary.data = this.data;
    }
  }
}

export class StartSavingSystem extends StoreEvent<State> {
  constructor(
    private store: IStore<State>
  ) {
    super();
  }

  update(state: State) {
    const recentStr = localStorage.getItem("recent-sessions");
    const recent = recentStr ? JSON.parse(recentStr) : [];
    state.recent = recent;
  }

  watch(state: State, events: Bus<State>): Bus<State> {
    return this.store.select((st: State) => st.sessions).pipe(
      rx.filter(s => !!s),
      rx.bufferCount(2, 1),
      rx.mergeMap(([prev, next]) => Object.entries(next).filter(([k, v]) => prev[k] !== v).map(([k, _]) => k)),
      rx.map(id => new SaveSession(id)),
    )
  }
}
