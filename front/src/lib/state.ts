
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
