import { browser } from '$app/environment';
import type { Idea } from "$state";

/* @type Idea[] */
import searchFake from "./fakeresponses/search.json";

/* @type Idea[] */
import moreFake from "./fakeresponses/more.json";

/* @type { response: string } */
import summaryFake from "./fakeresponses/summary.json";

let WAIT_TIME = 100;
let HOST = ""
let metadata: any = { tokenCount: 0 };

const FAKE_REPONSES = true;

if (browser && window.location.hostname === "localhost") {
  HOST = "http://localhost:5000";
}

function sleep(time: number) {
  return new Promise(res => setTimeout(res, time));
}

async function search(topic: string, previous: Idea[]=[]): Promise<Idea[]> {
  if (FAKE_REPONSES) {
    await sleep(WAIT_TIME);
    return searchFake;
  }
  
  const engine = (window as any).engine || "gpt-4";
  const response = await fetch(`${HOST}/api/next`, {
    method: "POST",
    mode: "cors",
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      metadata: metadata,
      topic: topic,
      previous: previous,
      engine,
    })
  });

  const responseJson = await response.json();
  metadata = responseJson["metadata"];
  console.log(metadata);
  const result = responseJson["result"] as Idea[];
  return result;
}

async function searchMore(topic: string, current: Idea[], previous: Idea[]=[]): Promise<Idea[]> {
  if (FAKE_REPONSES) {
    await sleep(WAIT_TIME);
    return moreFake;
  }

  const engine = (window as any).engine || "gpt-4";
  const response = await fetch(`${HOST}/api/more`, {
    method: "POST",
    mode: "cors",
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      metadata: metadata,
      topic: topic,
      current: current,
      previous: previous,
      engine,
    })
  });

  const responseJson = await response.json();
  metadata = responseJson["metadata"];
  console.log(metadata);
  const result = responseJson["result"]
  return result;
}

async function summary(topic: string, current: Idea[]) {
  if (FAKE_REPONSES) {
    await sleep(WAIT_TIME);
    return summaryFake["response"];
  }

  const engine = (window as any).engine || "gpt-4";
  const response = await fetch(`${HOST}/api/summary`, {
    method: "POST",
    mode: "cors",
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      metadata: metadata,
      topic: topic,
      current: current
    })
  });

  const responseJson = await response.json();
  metadata = responseJson["metadata"];
  console.log(metadata);
  const result = responseJson["result"]
  return result;
}

export default {
  search,
  searchMore,
  summary
};
