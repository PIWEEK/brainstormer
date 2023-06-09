import api from "./api.js";

// Global State

let topic = "";
let firstSearch = true;

let pendingRequest = false;

function init() {
  // Form handlers
  const searchForms = document.querySelectorAll(".searchForm");
  for (const searchForm of searchForms) {
    searchForm.addEventListener("submit", async (e) => {
      event.preventDefault();
      await doSearchTopic(e.target);
    });
  }

  const areas = document.querySelectorAll("textarea");
  for (const area of areas) {
    resizeTextArea(area);
    area.addEventListener("keydown", async (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        await doSearchTopic(e.target.parentElement);
      }
    });
    area.addEventListener("input", (e) => {
      resizeTextArea(e.target);
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

function resizeTextArea(area) {
  area.style["height"] = "0px";
  area.style["height"] = `${area.scrollHeight}px`;
}

const main = document.getElementsByTagName("main")[0];

const search = api.search;
const searchMore = api.searchMore;
const fetchSummary = api.summary;

// const search = api.fakeSearch;
// const searchMore = api.fakeSearchMore;
// const fetchSummary = api.fakeSummary;

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

async function doSearchTopic(form) {
  const input = form.querySelector(".searchInput");
  topic = input.value;

  if (pendingRequest || topic.trim() === "") return;

  cleanContent();

  if (firstSearch) {
    document.body.classList.add("exploration");
    document.querySelector("header").style["display"] = "flex";
    const searchForms = document.querySelectorAll(".searchForm");
    for (const searchForm of searchForms) {
      const input = searchForm.querySelector(".searchInput");
      input.value = topic;
      resizeTextArea(input);
    }
    firstSearch = false;
  }

  const section = createSection();
  let result = [];
  try {
    pendingRequest = true;
    result = await search(topic);
  } catch(error) {
    console.error(error);
    result = [{"title": "Error", "description": error.message}]
  } finally {
    pendingRequest = false;
  }
  addTopics(section, result);
}

async function doExploreItem(section) {
  if (pendingRequest) return;

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

  let result = [];
  try {
    pendingRequest = true;
    result = await search(topic, previous);
  } catch(error) {
    console.error(error);
    result = [{"title": "Error", "description": error.message}]
  } finally {
    pendingRequest = false;
  }

  addTopics(newSection, result);
}

async function doMoreItem(section) {
  if (pendingRequest) return;

  const selectedItems = document.querySelectorAll(".topic-item.selected");

  let previous = [];
  for (const item of selectedItems) {
    const input = item.querySelector("form").children[0].value;
    previous.push({
      "title": item.children[0].textContent,
      "description": item.children[1].textContent,
      "keywords": item.children[2].textContent,
      "input": (input !== "") ? input : null
    });
  }

  let current = [];
  for (const item of section.children[0].children) {
    current.push({
      "title": item.children[0].textContent,
      "description": item.children[1].textContent,
      "keywords": item.children[2].textContent
    });
  }

  let result;
  try{
    pendingRequest = true;
    result = await searchMore(topic, current, previous);
  } catch(error) {
    console.error(error);
    result = [{"title": "Error", "description": error.message}]
  } finally {
    pendingRequest = false;
  }
  addTopics(section, result);
  section.querySelector(".topic-item:last-child").scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
}

function selectItem(section, itemLi) {
  if (pendingRequest) return;

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
    if (!moreButton.disabled) {
      moreButton.disabled = true;
      const loader = createLoader(moreItem);
      await doMoreItem(section);
      loader.remove();
      moreButton.disabled = false;
    }
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

function createLoader(parent) {
  const loader = document.createElement("div")
  loader.className = "loader";
  parent.append(loader);

  const timeDiv = document.createElement("div");
  timeDiv.className = "time";
  timeDiv.textContent = "0s";
  loader.appendChild(timeDiv)

  window.lastloader = loader;

  let interval;
  const start = performance.now();
  interval = setInterval(() => {
    if (loader.isConnected) {
      const end = performance.now();
      timeDiv.textContent = `${new Number((end - start)/1000).toFixed(1)}s`
    } else {
      clearInterval(interval);
    }
  }, 100);

  return loader;
}

function createSection() {
  const section = document.createElement("section");
  section.className = "topics";
  main.append(section);

  createLoader(section);

  section.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
  return section;
}

function showSummaryHeader() {
  const header = document.querySelector("header");
  header.querySelector(".searchForm").style["display"] = "none";
  header.querySelector("#doneBtn").style["display"] = "none";
  const titleH2 = document.createElement("h2");
  titleH2.textContent = topic;
  header.appendChild(titleH2);
}

function showSummaryLoader() {
  const s1 = document.createElement("section");
  s1.className = 'topics';
  main.appendChild(s1);
  const s2 = document.createElement("section");
  s2.classList.add("topics");
  s2.classList.add("summary");
  createLoader(s2);
  main.appendChild(s2);
  return {s1, s2};
}

function removeSummaryLoader({s1, s2}) {
  s1.remove();
  s2.remove();
}

async function doShowSummary() {
  if (pendingRequest) return;

  const currentItems = document.querySelectorAll(".topic-item.selected");
  let current = [];
  for (const item of currentItems) {
    current.push({
      "title": item.children[0].textContent,
      "description": item.children[1].textContent
    });
  }

  cleanContent();

  showSummaryHeader();
  const l = showSummaryLoader();
  let summary;

  try {
    pendingRequest = true;
    summary = await fetchSummary(topic, current);
  } catch(error) {
    console.error(error);
    summary = `## Error\n ${error.message}`;
  } finally {
    pendingRequest = false;
  }

  removeSummaryLoader(l);

  createIdeationFlow(current);
  createSummary(summary);
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

  //const titleH3 = document.createElement("h3");
  //titleH3.textContent = "Summary";

  const summaryDiv = document.createElement("div");
  summaryDiv.innerHTML = marked.parse(text);
  summaryDiv.className = 'summary-content';

  const actionsDiv = document.createElement("div");
  actionsDiv.className = 'actions';

  //const priceDiv = document.createElement("div");
  //priceDiv.className = 'summary-price';
  //console.log(api.getMetadata("tokenCount"));
  //priceDiv.textContent = "Price: " + new Number(api.getMetadata("tokenCount") * (0.02 / 1000)).toFixed(2) + "$" ;


  const priceTitle = document.createElement("h2");
  priceTitle.textContent = "Price";

  const tokens = api.getMetadata("tokenCount")
  const price = new Number(tokens * (0.02 / 1000)).toFixed(2);

  const priceP1 = document.createElement("p");
  priceP1.textContent = `Total price: ${price}$`;

  const priceP2 = document.createElement("p");
  priceP2.textContent = `Tokens: ${tokens}`;

  //summaryDiv.appendChild(priceTitle);
  summaryDiv.appendChild(priceP1);
  summaryDiv.appendChild(priceP2);

  const copyBtn = document.createElement("button");
  copyBtn.className = 'secondary-button';
  copyBtn.textContent = "Copy text";
  copyBtn.addEventListener("click", () => navigator.clipboard.writeText(text));

  const startBtn = document.createElement("button");
  startBtn.className = 'primary-button';
  startBtn.textContent = "Start over";
  startBtn.addEventListener("click", () => location.reload());

  //section.appendChild(titleH3);
  section.appendChild(summaryDiv);
  //section.appendChild(priceDiv);
  section.appendChild(actionsDiv);
  actionsDiv.appendChild(copyBtn);
  actionsDiv.appendChild(startBtn);

  main.appendChild(section);
}

init();
