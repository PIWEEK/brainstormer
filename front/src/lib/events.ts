import { v4 as uuid } from 'uuid';
import { goto } from '$app/navigation';
import { empty, concat, of, from } from "rxjs";
import * as rx from "rxjs/operators"

import type { IStore, Bus } from "$store";
import type { State, Idea } from "$state";
import { selectedIdeas, hasLoadingSession, listIndex, context } from "$state";

import { StoreEvent } from "$store";
import api from "$lib/api";

import { formatSession, parseSession } from "$lib/serializer";

function newid(): string {
  return `${uuid()}`
}

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
    private listId: string,
    private ideas: Idea[]
  ) {
    super();
  }

  update(state: State) {
    const session = state.sessions[this.sessionId];
    const targetListIndex = listIndex(session, this.listId);

    if (targetListIndex !== null) {
      const current = session.lists[targetListIndex];
      current.state = "Loaded";

      const newIdeas = this.ideas.map((i: Idea, idx: number) => {
        return {...i, listId: this.listId, index: idx};
      })

      current.ideas = current.ideas.concat(newIdeas);
    }
  }
}

export class CreateSession extends StoreEvent<State> {
  private sessionId: string = newid();
  private listId: string = newid();

  constructor(private search: string) {
    super();
  }

  update(state: State) {
    state.currentSession = this.sessionId;
    state.sessions[this.sessionId] = {
      id: this.sessionId,
      topic: this.search,
      selected: new Set(),
      lists: [{
        id: this.listId,
        state: "InitialLoading",
        ideas: [],
        title: this.search,
      }]
    }
  }

  watch(state: State, events: Bus<State>): Bus<State> {
    goto("/session/" + this.sessionId);

    const { saved, liked, disliked } = context(state);

    return concat(
      from(api.search(this.search, [], saved, liked, disliked)).pipe(
        rx.map(data => new LoadIdeas(this.sessionId, this.listId, data))
      )
    );
  }
}

export class SelectIdeaCard extends StoreEvent<State> {
  constructor(
    private listId: string,
    private indexCard: number
  ) {
    super();
  }

  update(state: State) {
    const id = state.currentSession;

    if (!id) return;

    const selid = `${this.listId},${this.indexCard}`;
    const session = state.sessions[id];

    if (!session) return;

    if (!session.selected) {
      session.selected = new Set();
    }

    if (session.selected?.has(selid)) {
      return;
    }

    for (let e of session.selected) {
      if (e.startsWith(this.listId)) {
        session.selected?.delete(e);
      }
    }

    session.selected?.add(selid);
  }
}

export class NextList extends StoreEvent<State> {
  private newListId = newid();

  constructor(
    private listId: string,
    private indexCard: number,
    private input: string
  ) {
    super();
  }

  update(state: State) {
    const sesionId = state.currentSession;

    if (sesionId) {
      const session = state.sessions[sesionId];
      const listIdx = listIndex(session, this.listId);
      let listTitle = (listIdx !== null) ? session.lists[listIdx].ideas[this.indexCard].title : undefined;

      if (this.input && listIdx !== null) {
        session.lists[listIdx].ideas[this.indexCard].input = this.input;
        listTitle = listTitle + ": " + this.input
      }

      session.lists.push({
        state: "InitialLoading",
        id: this.newListId,
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
      const { saved, liked, disliked } = context(state);
      return from(api.search(topic, selectedIdeas(state), saved, liked, disliked)).pipe(
        rx.map(data => new LoadIdeas(id, this.newListId, data))
      );
    } else {
      return empty();
    }
  }
}

export class KeywordList extends StoreEvent<State> {
  private newListId = newid();

  constructor(
    private keyword: string
  ) {
    super();
  }

  update(state: State) {
    const sesionId = state.currentSession;

    if (sesionId) {
      const session = state.sessions[sesionId];

      session.lists.push({
        state: "InitialLoading",
        id: this.newListId,
        ideas: [],
        title: this.keyword,
      });
    }
  }

  watch(state: State, events: Bus<State>): Bus<State> {
    const id = state.currentSession;
    const session = id ? state.sessions[id] : undefined;
    const topic = session?.topic;

    if (id && session && topic){
      const { saved, liked, disliked } = context(state);
      return from(api.keyword(topic, this.keyword, saved, liked, disliked)).pipe(
        rx.map(data => new LoadIdeas(id, this.newListId, data))
      );
    } else {
      return empty();
    }
  }
}

export class MoreList extends StoreEvent<State> {
  constructor(
    private listId: string
  ) {
    super();
  }

  update(state: State) {
    const sessionId = state.currentSession;

    if (sessionId) {
      const session = state.sessions[sessionId];
      const indexList = listIndex(session, this.listId);

      if (session && indexList !== null){
        session.lists[indexList].state = "MoreLoading";
      }
    }
  }

  watch(state: State, events: Bus<State>): Bus<State> {
    const sessionId = state.currentSession;
    const session = sessionId ? state.sessions[sessionId] : undefined;
    const topic = session?.topic;
    const indexList = listIndex(session, this.listId);

    if (sessionId && session && topic && indexList !== null){
      const current = session.lists[indexList].ideas;
      const { saved, liked, disliked } = context(state);

      return from(api.more(topic, current, selectedIdeas(state), saved, liked, disliked)).pipe(
        rx.map(data => new LoadIdeas(sessionId, this.listId, data))
      );
    } else {
      return empty();
    }
  }
}

export class RemoveList extends StoreEvent<State> {
  constructor(
    private listId: string
  ) {
    super();
  }

  update(state: State) {
    const sessionId = state.currentSession;

    if (sessionId) {
      const session = state.sessions[sessionId];
      const indexList = listIndex(session, this.listId);

      if (session && indexList !== null){
        const listCopy = [...session.lists];
        const rest = listCopy.splice(indexList);
        rest.splice(0, 1);
        session.lists = listCopy.concat(rest);
      }
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
