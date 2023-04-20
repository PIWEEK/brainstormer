let HOST = ""

if (window.location.hostname === "localhost") {
  HOST = "http://localhost:5000";
}

function sleep(time) {
  return new Promise(res => setTimeout(res, time));
}

async function search(topic, previous=[]) {
  const response = await fetch(`${HOST}/api/next`, {
    method: "POST",
    mode: "cors",
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      topic: topic,
      previous: previous,
    })
  });

  const responseJson = await response.json();
  const result = responseJson["result"]
  return result;
}

async function searchMore(topic, current, previous) {
  const response = await fetch(`${HOST}/api/more`, {
    method: "POST",
    mode: "cors",
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      topic: topic,
      current: current,
      previous: previous,
    })
  });

  const responseJson = await response.json();
  const result = responseJson["result"]
  return result;
}

async function summary(topic, current) {
  const response = await fetch(`${HOST}/api/summary`, {
    method: "POST",
    mode: "cors",
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      topic: topic,
      current: current
    })
  });

  const responseJson = await response.json();
  const result = responseJson["result"]
  return result;
}


async function fakeSearch(topic, previous=[]) {
  await sleep(100);

  return [
    {
      "title": "Topic 1",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin at metus aliquam, feugiat leo id, ullamcorper urna. Etiam auctor justo augue, nec feugiat erat sagittis lacinia.",
    },
    {
      "title": "Topic 2",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin at metus aliquam, feugiat leo id, ullamcorper urna. Etiam auctor justo augue, nec feugiat erat sagittis lacinia.",
    },
    {
      "title": "Topic 3",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin at metus aliquam, feugiat leo id, ullamcorper urna. Etiam auctor justo augue, nec feugiat erat sagittis lacinia.",
    },
    {
      "title": "Topic 4",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin at metus aliquam, feugiat leo id, ullamcorper urna. Etiam auctor justo augue, nec feugiat erat sagittis lacinia.",
    },
    {
      "title": "Topic 5",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin at metus aliquam, feugiat leo id, ullamcorper urna. Etiam auctor justo augue, nec feugiat erat sagittis lacinia.",
    },
    
  ];
}

async function fakeSearchMore(topic, current, previous=[]) {
  await sleep(100);

  return [
    {
      "title": "More 1",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin at metus aliquam, feugiat leo id, ullamcorper urna. Etiam auctor justo augue, nec feugiat erat sagittis lacinia.",
    },
    {
      "title": "More 2",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin at metus aliquam, feugiat leo id, ullamcorper urna. Etiam auctor justo augue, nec feugiat erat sagittis lacinia.",
    },
    {
      "title": "More 3",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin at metus aliquam, feugiat leo id, ullamcorper urna. Etiam auctor justo augue, nec feugiat erat sagittis lacinia.",
    },
    {
      "title": "More 4",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin at metus aliquam, feugiat leo id, ullamcorper urna. Etiam auctor justo augue, nec feugiat erat sagittis lacinia.",
    },
    {
      "title": "More 5",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin at metus aliquam, feugiat leo id, ullamcorper urna. Etiam auctor justo augue, nec feugiat erat sagittis lacinia.",
    },
  ];
}

async function fakeSummary(topic, current) {
  await sleep(100);
  return `
## Pros and cons for every idea

### Catsy
- Pros: Easy to remember, distinctive name; playful and adventurous connotations.
- Cons: May be too generic for some people.

### Catseye
- Pros: Wise and curious associations; eye reference could make it stand out.
- Cons: Too obvious of a visual reference.

### Catsy Moonbeam
- Pros: Elegant and mysterious connotations; memorable name. 
- Cons: May be too long or difficult to remember. 

### Catseyed
- Pros: Wise and curious associations; eye reference could make it stand out. 
- Cons: Name could be hard to pronounce or spell. 

### Catsyful
- Pros: Playful and curious connotations; easy to remember. 
- Cons: May not be distinct enough for some tastes.

## Summary

Overall, Catsy and Catsy Moonbeam seem to be the best options. Both have memorable names that evoke a sense of playfulness and adventure. Catsy is shorter and easier to remember, while Catsy Moonbeam has an elegant and mysterious quality. Catseye and Catseyed both focus too much on the eye reference, which may not be distinct enough for some people, while Catsyful does not have a strong enough connotation to stand out from other cat names.
`;
}

export default {
  search,
  searchMore,
  summary,
  fakeSearch,
  fakeSearchMore,
  fakeSummary,
};
