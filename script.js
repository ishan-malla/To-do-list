const listContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const listDeleteBtn = document.querySelector("[data-delete-list-btn]");
const listDisplay = document.querySelector("[data-list-display-container]");
const listTitle = document.querySelector("[data-list-title]");
const listCount = document.querySelector("[data-list-count]");
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input]");
const completedTaskDelete = document.querySelector("[data-delete-task-btn]");
const listTask = document.querySelector("[data-tasks]");
const taskTemplate = document.querySelector("#template");
const LOCAL_STORAGE_KEY = "task.lists";
const taskElements = document.querySelector("task");
const LOCAL_STORAGE_SELECTED = "task.selectedListId";
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED) || null;

let count = localStorage.getItem("count") || 0;

newListForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName == null || listName === "") return;
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  saveAndRender();
});

newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskName = newTaskInput.value;
  if (taskName == null || taskName === "") return;
  const tasks = createTask(taskName);
  newTaskInput.value = null;
  const selectedlist = lists.find((list) => list.id === selectedListId);
  selectedlist.task.push(tasks);
  saveAndRender();
});

function createTask(task) {
  return {
    id: Date.now().toString(),
    name: task,
    complete: false,
  };
}

listContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedListId = e.target.dataset.listId;
    saveAndRender();
  }
});

function createList(listName) {
  return {
    id: Date.now().toString(),
    name: listName,
    task: [],
  };
}

listTask.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedList = lists.find((list) => list.id === selectedListId);
    const selectedTask = selectedList.task.find(
      (task) => task.id === e.target.id
    );
    selectedTask.complete = e.target.checked;
    saveAndRender();
    renderTaskCount(selectedList);
  }
});

listDeleteBtn.addEventListener("click", (e) => {
  lists = lists.filter((list) => list.id !== selectedListId);
  selectedListId = null;
  saveAndRender();
});

function render() {
  clearElement(listContainer);
  renderLists();
  const selectedList = lists.find((list) => list.id === selectedListId);
  if (!selectedList) {
    listDisplay.style.display = "none";
  } else {
    listDisplay.style.display = "";
    listTitle.innerText = selectedList.name;
    renderTaskCount(selectedList);
    clearElement(listTask);
    renderTask(selectedList);
  }
}

completedTaskDelete.addEventListener("click", (e) => {
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.task = selectedList.task.filter((task) => !task.complete);

  saveAndRender();
});

function renderTask(selectedList) {
  selectedList.task.forEach((tasks) => {
    const taskEle = document.importNode(taskTemplate.content, true);
    const checkbox = taskEle.querySelector("input");
    checkbox.id = tasks.id;
    checkbox.checked = tasks.complete;
    const label = taskEle.querySelector("label");
    label.htmlFor = tasks.id;
    label.append(tasks.name);
    listTask.appendChild(taskEle);
  });
}

function renderTaskCount(selected) {
  const incompleteTasks = selected.task.filter((task) => !task.complete);
  const incompleteTaskCount = incompleteTasks.length;
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
  listCount.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

function renderLists() {
  lists.forEach((content) => {
    const listElement = document.createElement("li");
    listElement.dataset.listId = content.id;
    listElement.classList.add("list-name");
    listElement.innerText = content.name;
    listContainer.appendChild(listElement);
    if (content.id === selectedListId) {
      listElement.classList.add("active-list");
    }
  });
}

function saveAndRender() {
  render();
  save();
}
function save() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED, selectedListId);
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  saveAndRender();
});
