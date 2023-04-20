import api from "./api.js";

// Global State

let topic = "";
let firstSearch = true;

function init() {
  // Form handlers
  const searchForms = document.querySelectorAll(".searchForm");
  for (const searchForm of searchForms) {
    searchForm.addEventListener("submit", async () => {
      event.preventDefault();
      await doSearchTopic();
    });
  }

  const logoLink = document.querySelector(".main-logo-link");
  logoLink.addEventListener("click", (e) => {
    e.preventDefault();
    location.reload();
  });

  const doneBtn = document.getElementById("doneBtn");
  doneBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    await doShowSummary();
  });
}

const main = document.getElementsByTagName("main")[0];

const search = api.search;
const searchMore = api.searchMore;
const fetchSummary = api.summary;

//const search = api.fakeSearch;
//const searchMore = api.fakeSearchMore;
//const fetchSummary = api.fakeSummary;

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

async function doSearchTopic() {
  const input = event.target.querySelector("input");
  topic = input.value;

  cleanContent();

  if (firstSearch) {
    document.body.classList.add("exploration");
    document.querySelector("header").style["display"] = "flex";
    const searchForms = document.querySelectorAll(".searchForm");
    for (const searchForm of searchForms) {
      searchForm.children[0].value = topic;
    }
    firstSearch = false;
  }
  
  const section = createSection();
  const result = await search(topic);
  addTopics(section, result);
}

async function doExploreItem(section) {
  const selectedItems = document.querySelectorAll(".topic-item.selected");
  let previous = [];
  for (const item of selectedItems) {
    const input = item.children[3].children[0].value;
    previous.push({
      "title": item.children[0].textContent,
      "description": item.children[1].textContent,
      "keywords": item.children[2].textContent,
      "input": (input !== "") ? input : null
    });
  }
  removeSiblings(section);
  const newSection = createSection();
  const result = await search(topic, previous);
  addTopics(newSection, result);
}

async function doMoreItem(section) {
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
      "keywords": item.children[2].textContent,
      "input": (input !== "") ? input : null
    });
  }

  const currentItems = document.querySelectorAll(".topic-item.selected");
  let current = [];
  for (const item of section.children[0].children) {
    current.push({
      "title": item.children[0].textContent,
      "description": item.children[1].textContent,
      "keywords": item.children[2].textContent
    });
  }

  const result = await searchMore(topic, current, previous);
  addTopics(section, result);
  section.querySelector(".topic-item:last-child").scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
}

function selectItem(section, itemLi) {
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
  removeSiblings(section);
  itemLi.append(createMoreLikeThisForm(section));
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
    await doExploreItem(parent);
  });

  const svg = createIconSVG();
  button.append(svg);
  form.append(input);
  form.append(button);
  return form;
}

function createItem(parent, {title, description, keywords}) {
  const itemLi = document.createElement("li");
  itemLi.className = "topic-item";

  const titleP = document.createElement("p");
  titleP.className = "topic-item-title";
  titleP.textContent = title;
  
  const descriptionP = document.createElement("p");
  descriptionP.className = "topic-item-description";
  descriptionP.textContent = description;
  
  const keywordsP = document.createElement("p");
  keywordsP.className = "topic-item-keywords";
  keywordsP.textContent = keywords;
  
  itemLi.addEventListener("click", () => {
    if (!itemLi.classList.contains("selected")) {
      selectItem(parent, itemLi);
    }
  });
  
  itemLi.append(titleP);
  itemLi.append(descriptionP);
  itemLi.append(keywordsP);
  
  return itemLi;
}

function createMoreItem(section) {
  const moreItem = document.createElement("div");
  const moreButton = document.createElement("button");
  moreButton.textContent = "+ More ideas";
  moreItem.className = "topic-more";
  moreItem.append(moreButton);

  moreButton.addEventListener("click", async (e) => {
    await doMoreItem(section);
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

function createSection() {
  const section = document.createElement("section");
  section.className = "topics";
  main.append(section);

  const loader = document.createElement("div")
  loader.className = "loader";
  section.append(loader);

  section.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
  return section;
}

async function doShowSummary() {
  const currentItems = document.querySelectorAll(".topic-item.selected");
  let current = [];
  for (const item of currentItems) {
    current.push({
      "title": item.children[0].textContent,
      "description": item.children[1].textContent
    });
  }

  console.log(current);
  cleanContent();
  
  const summary = await fetchSummary(topic, current);

  createIdeationFlow(current);
  createSummary(summary);

  const header = document.querySelector("header");
  
  // Delete search form
  header.querySelector(".searchForm").style["display"] = "none";

  // Delete I'm done
  header.querySelector("#doneBtn").style["display"] = "none";

  // Add h2 with title
  const titleH2 = document.createElement("h2");
  titleH2.textContent = topic;

  header.appendChild(titleH2);
}


function createIdeationFlow(current) {
  const section = document.createElement("section");
  section.className = 'topics';

  const titleH3 = document.createElement("h3");
  titleH3.textContent = "Your ideation flow";
  
  const ul = document.createElement("ul");
  for (const item of current) {
    ul.appendChild(createItem(section, item));
  }

  section.appendChild(titleH3);
  section.appendChild(ul);

  main.appendChild(section);
}

function createSummary(text) {
  const section = document.createElement("section");
  section.classList.add("topics");
  section.classList.add("summary");

  const titleH3 = document.createElement("h3");
  titleH3.textContent = "Summary";

  const summaryP = document.createElement("p");
  summaryP.innerHTML = marked.parse(text);

  const actionsDiv = document.createElement("div");
  actionsDiv.className = 'actions';
  
  const copyBtn = document.createElement("button");
  copyBtn.className = 'secondary-button';
  copyBtn.textContent = "Copy text";
  copyBtn.addEventListener("click", () => navigator.clipboard.writeText(text));
  
  const startBtn = document.createElement("button");
  startBtn.className = 'primary-button';
  startBtn.textContent = "Start over";
  startBtn.addEventListener("click", () => location.reload());

  section.appendChild(titleH3);
  section.appendChild(summaryP);
  section.appendChild(actionsDiv);
  actionsDiv.appendChild(copyBtn);
  actionsDiv.appendChild(startBtn);

  main.appendChild(section);
}




init();
