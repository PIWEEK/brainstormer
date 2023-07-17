
type ID = string;

export interface Idea {
  title: string;
  tags: string[];
  description: string;
  input?: string;

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
  sessions: Record<ID, Session>;
}

export const initialState: State = {
  sessions: {}
}

function li() {
  return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer cursus enim in ante pharetra, vitae tempus dolor scelerisque. Aliquam erat volutpat. Nulla pellentesque lacus mollis maximus vestibulum. Mauris lectus ipsum, porta ut mi ac, vulputate consequat nulla. Maecenas sed lectus lobortis, lacinia urna id, tristique dolor. ";
}

export const fakeState: State = {
  sessions: {
    "kkkkk": {
      id: "kkkkk",
      topic: "Plans for kids on a rainy day",

      lists: [
        {
          state: 'Loaded',
          ideas: [
            {title: "Idea 1", description: li(), tags: ["t1", "t2", "t3"]},
            {title: "Idea 2", description: li(), tags: ["t1", "t2", "t3"]},
            {title: "Idea 3", description: li(), tags: ["t1", "t2", "t3"]},
            {title: "Idea 4", description: li(), tags: ["t1", "t2", "t3"]},
            {title: "Idea 5", description: li(), tags: ["t1", "t2", "t3"]},
          ]
        },
        {
          state: 'Loaded',
          ideas: [
            {title: "Idea 1", description: li(), tags: ["t1", "t2", "t3"]},
            {title: "Idea 2", description: li(), tags: ["t1", "t2", "t3"]},
            {title: "Idea 3", description: li(), tags: ["t1", "t2", "t3"]},
            {title: "Idea 4", description: li(), tags: ["t1", "t2", "t3"]},
            {title: "Idea 5", description: li(), tags: ["t1", "t2", "t3"]},
          ]
        },
        {
          state: 'Loaded',
          ideas: [
            {title: "Idea 1", description: li(), tags: ["t1", "t2", "t3"]},
            {title: "Idea 2", description: li(), tags: ["t1", "t2", "t3"]},
            {title: "Idea 3", description: li(), tags: ["t1", "t2", "t3"]},
            {title: "Idea 4", description: li(), tags: ["t1", "t2", "t3"]},
            {title: "Idea 5", description: li(), tags: ["t1", "t2", "t3"]},
          ]
        }
      ] 
    }
  }
}
