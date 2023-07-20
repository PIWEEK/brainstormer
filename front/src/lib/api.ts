import { browser } from '$app/environment';
import type { Idea } from "$state";
import { PUBLIC_FAKE_RESPONSES } from '$env/static/public';

/* @type Idea[] */
import searchFake from "./fakeresponses/search.json";

/* @type Idea[] */
import moreFake from "./fakeresponses/more.json";

/* @type { response: string } */
import summaryFake from "./fakeresponses/summary.json";

let WAIT_TIME = 100;
let HOST = ""
let metadata: any = { tokenCount: 0 };

const FAKE_RESPONSES = false; //PUBLIC_FAKE_RESPONSES === "true";
console.log("FAKE_RESPONSES", FAKE_RESPONSES);

if (browser && window.location.hostname === "localhost") {
  HOST = "http://localhost:5000";
}

function sleep(time: number) {
  return new Promise(res => setTimeout(res, time));
}

async function post<T>(uri: string, data: Object): Promise<T> {
  const engine = (window as any).engine || "gpt-4";
  const response = await fetch(`${HOST}/api/${uri}`, {
    method: "POST",
    mode: "cors",
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({...data, metadata, engine})
  });

  const responseJson = await response.json();
  metadata = responseJson["metadata"];
  return responseJson["result"] as T;
}

async function search(topic: string): Promise<Idea[]> {
  if (FAKE_RESPONSES) {
    await sleep(WAIT_TIME);
    return searchFake;
  }
  return post<Idea[]>("next", { topic });
}

async function next(topic: string, previous: Idea[], saved: Idea[], liked: Idea[], disliked: Idea[]): Promise<Idea[]> {
  if (FAKE_RESPONSES) {
    await sleep(WAIT_TIME);
    return searchFake;
  }
  return post<Idea[]>("next", { topic, previous, saved, liked, disliked });
}

async function keyword(topic: string, keyword: string, saved: Idea[], liked: Idea[], disliked: Idea[]): Promise<Idea[]> {
  if (FAKE_RESPONSES) {
    await sleep(WAIT_TIME);
    return searchFake;
  }
  return post<Idea[]>("keyword", { topic, keyword, saved, liked, disliked });
}

async function more(topic: string, current: Idea[], previous: Idea[], saved: Idea[], liked: Idea[], disliked: Idea[]): Promise<Idea[]> {
  if (FAKE_RESPONSES) {
    await sleep(WAIT_TIME);
    return moreFake;
  }

  return post<Idea[]>("more", { topic, current, previous, saved, liked, disliked });
}

async function summary(topic: string, current: Idea[]): Promise<string> {
  if (FAKE_RESPONSES) {
    await sleep(WAIT_TIME);
    return summaryFake["response"];
  }

  return post<string>("summary", { topic, current });
}

export default {
  search,
  next,
  more,
  summary,
  keyword,
};
