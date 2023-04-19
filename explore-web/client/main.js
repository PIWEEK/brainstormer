
const searchForm = document.getElementById("searchForm");
searchForm.addEventListener("submit", doSearch);

const main = document.getElementsByTagName("main")[0];

let topic = "";

function sleep(time) {
  return new Promise(res => setTimeout(res, time));
}

function cleanContent() {
  const children = main.children;
  for (const child of children) {
    main.removeChild(child);
  }
}

function removeSiblings(node) {
  const parent = node.parentElement;

  let toDelete = [];
  let deleting = false;
  for (const c of parent.children) {
    if (deleting) {
      toDelete.push(c);
    } else if (c == node) {
      deleting = true;
    }
  }

  for (const node of toDelete) {
    parent.removeChild(node);
  }
}

function createItem(parent, {title, description}) {
  const itemLi = document.createElement("li");
  itemLi.className = "topic-item";

  const titleP = document.createElement("p");
  titleP.className = "topic-item-title";
  titleP.textContent = title;
  
  const descriptionP = document.createElement("p");
  descriptionP.className = "topic-item-description";
  descriptionP.textContent = description;
  
  const moreBtn = document.createElement("button");
  moreBtn.className = "topic-item-more-btn";
  moreBtn.textContent = ">";
  moreBtn.addEventListener("click", async () => {
    for (const c of itemLi.parentElement.children) {
      c.classList.remove("selected");
    }
    itemLi.classList.add("selected")
    removeSiblings(parent);

    const selectedItems = document.querySelectorAll(".topic-item.selected");
    let previous = [];
    for (const item of selectedItems) {
      previous.push({
        "title": item.children[0].textContent,
        "description": item.children[1].textContent,
      });
    }
    
    const section = createSection();
    const result = await search(topic, previous);
    addTopics(section, result);
  });
  
  itemLi.append(titleP);
  itemLi.append(descriptionP);
  itemLi.append(moreBtn);
  
  return itemLi;
}

function createMoreItem() {
  const moreItem = document.createElement("li");
  const moreButton = document.createElement("button");
  moreButton.textContent = "More...";
  moreItem.className = "topic-more";
  moreItem.append(moreButton);
  return moreItem;
}

function addTopics(section, result) {
  const ul = document.createElement("ul");

  for (const item of result) {
    ul.append(createItem(section, item));
  }
  ul.append(createMoreItem());

  section.removeChild(section.children[0]);
  section.append(ul);  
}

async function fakeSearch(topic, previous=[]) {
  console.log("FAKE", topic, previous);
  await sleep(1000);

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
  console.log(responseJson);
  const result = responseJson["result"]
  console.log(result);
  return result;
}

function createSection() {
  const section = document.createElement("section");
  section.className = "topics";
  main.append(section);

  const loader = document.createElement("div")
  loader.className = "loader";
  loader.textContent = "loading...";
  section.append(loader);

  section.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
  return section;
}

async function doSearch(event) {
  event.preventDefault();
  
  const input = document.getElementById("searchInput");
  cleanContent();

  topic = input.value;

  const section = createSection();
  const result = await search(topic);
  console.log(result);
  addTopics(section, result);
}


