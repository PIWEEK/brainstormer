
type ID = string;

export interface Idea {
  title: string;
  description: string;
  keywords: string;
  input?: string | null;

  liked?: boolean;
  disliked?: boolean;
  saved?: boolean;
}

export interface IdeaList {
  state: 'Loaded' | 'InitialLoading' | 'MoreLoading';
  ideas: Idea[];
}

export interface Session {
  id: ID;
  topic: string;
  lists: IdeaList[];
  summary?: {
    state: 'Loading' | 'Loaded',
    data?: string
  }
}

export interface State {
  currentSession?: string;
  selected?: Set<string>;
  sessions: Record<ID, Session>;
}

export const initialState: State = {
  sessions: {}
}

export function li() {
  return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer cursus enim in ante pharetra, vitae tempus dolor scelerisque. Aliquam erat volutpat. Nulla pellentesque lacus mollis maximus vestibulum. Mauris lectus ipsum, porta ut mi ac, vulputate consequat nulla. Maecenas sed lectus lobortis, lacinia urna id, tristique dolor. ";
}


// Number of lists to fake
const FAKE_NUM_LISTS = 5;

// Number of ideas per list
const FAKE_NUM_IDEAS = 20;

export const fakeState: State = {
  selected: new Set(),
  sessions: {
    "fake-id": {
      id: "fake-id",
      topic: "Plans for kids on a rainy day",
      lists: [...Array(FAKE_NUM_LISTS).fill(0)].map((_, i) => ({
        state: 'Loaded',
        ideas: [...Array(FAKE_NUM_IDEAS).fill(0)].map((_, i) => ({
          title: "Idea " + i,
          description: li(),
          keywords: "t1 \u00b7 t2 \u00b7 t3"
        }))
      }))
    }
  }
}

export function selectedIdeas(state: State): Idea[] {
  const id = state.currentSession;

  if (!state.selected || !id) {
    return [];
  }

  const result = [] as Idea[];
  for (const v of state.selected) {
    const [listIdxStr, cardIdxStr] = v.split(",");
    const listIdx = parseInt(listIdxStr, 10);
    const cardIdx = parseInt(cardIdxStr, 10);

    const idea = state.sessions[id].lists[listIdx]?.ideas[cardIdx];

    if (idea) {
      result.push(idea);
    }
  }
  return result;
}

export function currentSession(state: State): Session | null {
  return state.currentSession ? state.sessions[state.currentSession] : null;
}
