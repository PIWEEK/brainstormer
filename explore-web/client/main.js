// Global State

let topic = "";
let firstSearch = true;


// Form handlers
const searchForms = document.querySelectorAll(".searchForm");
for (const searchForm of searchForms) {
  searchForm.addEventListener("submit", doSearch);
}

const logoLink = document.querySelector(".main-logo-link");
logoLink.addEventListener("click", (e) => {
  e.preventDefault();
  location.reload();
})

const main = document.getElementsByTagName("main")[0];

const search = apiSearch;
const searchMore = apiSearchMore;
//const search = fakeSearch;
//const searchMore = fakeSearchMore;


function sleep(time) {
  return new Promise(res => setTimeout(res, time));
}

function cleanContent() {
  const children = [...main.children];
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

function createIconSVG() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M21.061,11.077,3.741,4.157a.994.994,0,0,0-1.17.32,1,1,0,0,0-.01,1.22l4.49,6a.525.525,0,0,1-.01.62L2.511,18.3a1.02,1.02,0,0,0,0,1.22,1,1,0,0,0,.8.4,1.021,1.021,0,0,0,.38-.07l17.36-6.9a1.006,1.006,0,0,0,.01-1.87ZM3.371,5.087l16.06,6.42H8.061a1.329,1.329,0,0,0-.21-.41Zm-.06,13.82,4.53-5.98a1.212,1.212,0,0,0,.22-.42h11.38Z");
  svg.appendChild(path);
  return svg;
}

function createMoreLikeThisForm(parent) {
  const form = document.createElement("form");
  form.className = "topic-select";
  
  const input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("placeholder", "More like this");

  const button = document.createElement("button");
  button.className = "submit-btn";
  button.setAttribute("type", "submit");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const selectedItems = document.querySelectorAll(".topic-item.selected");
    let previous = [];
    for (const item of selectedItems) {
      const input = item.children[2].children[0].value;
      previous.push({
        "title": item.children[0].textContent,
        "description": item.children[1].textContent,
        "input": (input !== "") ? input : null
      });
    }
    removeSiblings(parent);
    const section = createSection();
    const result = await search(topic, previous);
    addTopics(section, result);
  });

  const svg = createIconSVG();
  button.append(svg);
  form.append(input);
  form.append(button);
  return form;
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
  
  itemLi.addEventListener("click", async () => {
    
    if (!itemLi.classList.contains("selected")) {
      for (const c of itemLi.parentElement.children) {
        c.classList.remove("selected");
        c.classList.add("not-selected");

        const selectChild = c.querySelector(".topic-select");
        if (selectChild) {
          c.removeChild(selectChild);
        }
      }
      itemLi.classList.remove("not-selected")
      itemLi.classList.add("selected")
      removeSiblings(parent);

      itemLi.append(createMoreLikeThisForm(parent));
    }
  });
  
  itemLi.append(titleP);
  itemLi.append(descriptionP);
  
  return itemLi;
}

function createMoreItem(section) {
  const moreItem = document.createElement("div");
  const moreButton = document.createElement("button");
  moreButton.textContent = "+ More ideas";
  moreItem.className = "topic-more";
  moreItem.append(moreButton);

  moreButton.addEventListener("click", async (e) => {
    removeSiblings(section);

    for (const c of section.children[0].children) {
      c.classList.remove("selected");
      c.classList.remove("not-selected");

      const selectChild = c.querySelector(".topic-select");
      if (selectChild) {
        c.removeChild(selectChild);
      }
    }

    const selectedItems = document.querySelectorAll(".topic-item.selected");
    let previous = [];
    for (const item of selectedItems) {
      const input = item.children[2].children[0].value;
      previous.push({
        "title": item.children[0].textContent,
        "description": item.children[1].textContent,
        "input": (input !== "") ? input : null
      });
    }

    const currentItems = document.querySelectorAll(".topic-item.selected");
    let current = [];
    for (const item of section.children[0].children) {
      current.push({
        "title": item.children[0].textContent,
        "description": item.children[1].textContent
      });
    }

    const result = await searchMore(topic, current, previous);
    addTopics(section, result);
    section.querySelector(".topic-item:last-child").scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
  });
  return moreItem;
}

function addTopics(section, result) {
  let ul;

  if (section.children[0] && section.children[0].tagName === "UL") {
    ul = section.children[0];
  } else {
    section.removeChild(section.children[0]);
    ul = document.createElement("ul");
    section.appendChild(ul);  
    section.appendChild(createMoreItem(section));
  }
  
  for (const item of result) {
    ul.appendChild(createItem(section, item));
  }
  
}

async function fakeSearch(topic, previous=[]) {
  console.log("FAKE", topic, previous);
  //await sleep(1000);

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
  await sleep(1000);

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

async function apiSearch(topic, previous=[]) {
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

async function apiSearchMore(topic, current, previous) {
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

  const input = event.target.querySelector("input");
  topic = input.value;

  cleanContent();

  if (firstSearch) {
    document.body.classList.add("exploration");

    document.querySelector("header").style["display"] = "flex";

    for (const searchForm of searchForms) {
      searchForm.children[0].value = topic;
    }

    firstSearch = false;
  }
  
  const section = createSection();
  const result = await search(topic);
  addTopics(section, result);
}


