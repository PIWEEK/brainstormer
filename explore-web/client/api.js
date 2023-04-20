async function search(topic, previous=[]) {
  console.log("SEARCH", topic, previous)
  const response = await fetch("http://localhost:5000/next", {
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
  console.log("MORE", topic, current, previous)
  const response = await fetch("http://localhost:5000/more", {
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


async function fakeSearch(topic, previous=[]) {
  console.log("FAKE", topic, previous);
  //await sleep(500);

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
  console.log("FAKE", topic, current, previous);
  //await sleep(500);

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

export default {
  search,
  searchMore,
  fakeSearch,
  fakeSearchMore,
};
