
type ID = string;

export interface Idea {
  title: string;
  description: string;
  keywords: string;
  input?: string | null;

  listId?: string;
  liked?: boolean;
  disliked?: boolean;
  saved?: boolean;
}

export interface IdeaList {
  state: 'Loaded' | 'InitialLoading' | 'MoreLoading';
  id: string;
  ideas: Idea[];
  title?: string;
}

export interface Session {
  id: ID;
  topic: string;
  selected?: Set<string>;
  lists: IdeaList[];

  saved?: Idea[];
  liked?: Idea[];
  disliked?: Idea[];
  
  summary?: {
    state: 'Loading' | 'Loaded',
    data?: string
  }
}

export interface State {
  currentSession?: string;
  recent?: {id: string; topic: string}[];
  sessions: Record<ID, Session>;
}

export const initialState: State = {
  sessions: {}
}

export function selectedIdeas(state: State): Idea[] {
  const id = state.currentSession;

  if (!id) return [];

  const session = state.sessions[id];

  if (!session || !session.selected) return [];

  const result = [] as Idea[];
  for (const v of session.selected) {
    const [listId, cardIdxStr] = v.split(",");
    const listIdx = listIndex(session, listId);
    const cardIdx = parseInt(cardIdxStr, 10);

    if (listIdx === null) {
      continue;
    }

    const idea = session.lists[listIdx]?.ideas[cardIdx];

    if (idea) {
      result.push(idea);
    }
  }
  return result;
}

export function currentSession(state: State): Session | null {
  return state.currentSession ? state.sessions[state.currentSession] : null;
}

// Checks if the session is still loading some element
export function hasLoadingSession(session: Session): boolean {
  return session.lists.some(l => l.state !== "Loaded") ||
    (!!session.summary && session.summary.state !== "Loaded");
}

export function listIndex(session: Session | undefined, id: string): number | null{
  if (!session) {
    return null;
  }
  
  const idx = session.lists.findIndex(l => l.id === id);

  if (idx === -1) {
    return null;
  }

  return idx;
}

export function updateCard(state: State, listId: string, indexCard: number, updatefn: (i:Idea)=>void): void {
  const session = currentSession(state);

  if (!session) {
    return;
  }

  const listIdx = listIndex(session, listId);

  if (listIdx === null) {
    return;
  }
  
  const idea = session.lists[listIdx].ideas[indexCard];

  if (!idea) {
    return;
  }

  updatefn(idea);
}

export function queryIdeas(state: State, predicate: (idea: Idea) => boolean): Idea[] {
  const result = [] as Idea[];
  const session = currentSession(state);

  if (!session) {
    return result;
  }

  for (const list of session.lists) {
    for (const idea of list.ideas) {
      if (predicate(idea)) {
        result.push(idea);
      }
    }
  }
  return result;
}

export function context(state: State): { saved: Idea[], liked: Idea[], disliked: Idea[] } {
  const saved = queryIdeas(state, (i: Idea) => !!i.saved);
  const liked = queryIdeas(state, (i: Idea) => !!i.liked);
  const disliked = queryIdeas(state, (i: Idea) => !!i.disliked);
  return { saved, liked, disliked };

}
