/*******************************Change Theme*********************************/
const toggle = document.querySelector('.todo__toggle');
const theme = document.querySelector('[data-theme]');
const toggleIcon = document.querySelector('.todo__toggle-image');
const LOCAL_STORAGE_THEME_KEY = 'task.theme';
let currentTheme = JSON.parse(localStorage.getItem(LOCAL_STORAGE_THEME_KEY));

toggle.addEventListener('click', () => {
  if (theme.getAttribute('data-theme') === 'light') {
    theme.setAttribute('data-theme', 'dark');
    toggleIcon.src = '/images/icon-sun.svg';
    currentTheme = 'dark';
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, JSON.stringify(currentTheme));
  } else {
    theme.setAttribute('data-theme', 'light');
    toggleIcon.src = '/images/icon-moon.svg';
    currentTheme = 'light';
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, JSON.stringify(currentTheme));
  }
});

//initialize theme
function setTheme() {
  if (currentTheme === 'dark') {
    // Theme set to dark.
    theme.setAttribute('data-theme', 'dark');
  } else {
    // Theme set to light.
    theme.setAttribute('data-theme', 'light');
  }
}
setTheme();

/*******************************Todo App*********************************/

const newTaskInput = document.querySelector('[data-new-task-input]');
const newTaskForm = document.querySelector('[data-new-task-form]');
const tasks = document.querySelector('.todo__tasks');
//Creating KEY
const LOCAL_STORAGE_LIST_KEY = 'task.lists';

//check if there is local storage or set empty
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];

let itemLeftCount = document.querySelectorAll('[data-task-remaining]');
let buttonCompleted = document.querySelectorAll('[data-clear-completed]');
let buttonFilterComplete = document.querySelector('[data-completed-button]');
let buttonFilterActive = document.querySelector('[data-active-button]');
let buttonFilterAll = document.querySelector('[data-all-button]');

//Task List Even Listener when user click each task i.e. delete and complete task
tasks.addEventListener('click', (e) => {
  //When user put check on checkbox
  if (e.target.classList.contains('todo__task--complete')) {
    let itemKey = e.target.parentElement.dataset.listId;
    toggleDone(itemKey);
  }
  if (e.target.classList.contains('todo__task--delete')) {
    //DELETE When user Click  X Button
    let itemKey = e.target.parentElement.dataset.listId;
    lists = lists.filter((list) => list.id !== parseInt(itemKey));
    itemKey = null;
    saveAndRender();
  }
});

function toggleDone(key) {
  let index = lists.findIndex((list) => list.id === Number(key));
  lists[index].checked = !lists[index].checked;
  saveAndRender();
}

//Add New Task
newTaskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskName = newTaskInput.value;
  if (taskName === null || taskName === '') return;
  const task = createTask(taskName);
  newTaskInput.value = null;
  lists.push(task);
  saveAndRender();
});

function createTask(name) {
  return {
    id: Date.now(),
    checked: false,
    name: name,
  };
}

function saveAndRender() {
  save();
  render(lists);
}

//save tasks in local storage
function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
}

function render(listsFilter) {
  let emptyState = document.querySelector('.empty-state');
  if (listsFilter.length === 0) {
    emptyState.style.display = 'block';
    itemLeftCount.forEach(
      (itemLeft) => (itemLeft.innerText = 'No Tasks remaining')
    );
  } else {
    emptyState.style.display = 'none';
  }

  clearTasks(tasks);
  //loop task in a task Lists
  listsFilter.forEach((list) => {
    const item = document.createElement('div');
    let isChecked = list.checked ? 'todo__done' : '';
    item.innerHTML = ` 
        <input id="${list.id}" class="todo__task--complete ${isChecked}" type="checkbox"/>
        <label class="todo__task-name" for="${list.id}">${list.name}</label>
        <button class="todo__task--delete">
          <img src="/images/icon-cross.svg" alt="delete button " />
        </button>
    `;
    item.classList.add('todo__task');
    item.dataset.listId = list.id;
    tasks.appendChild(item);
    itemTaskCount();
  });
}
//Count Task Left Function
function itemTaskCount() {
  const incompleteTaskCount = lists.filter((task) => !task.checked).length;
  const taskString = incompleteTaskCount === 1 ? 'task' : 'tasks';
  itemLeftCount.forEach(
    (itemLeft) =>
      (itemLeft.innerText = `${incompleteTaskCount} ${taskString} remaining`)
  );
}

//Clear Completed Event Listener, Loop for each buttons one for mobile view and Desktop View
buttonCompleted.forEach((button) =>
  button.addEventListener('click', () => {
    lists = lists.filter((list) => list.checked === false);
    saveAndRender();
  })
);

//Filter Completed Even Listener

buttonFilterComplete.addEventListener('click', () => {
  let filterComplete = lists.filter((task) => task.checked === true);
  render(filterComplete);
});

//Filter Active
buttonFilterActive.addEventListener('click', () => {
  let filterActive = lists.filter((task) => !task.checked);
  render(filterActive);
});

buttonFilterAll.addEventListener('click', () => {
  render(lists);
});

//Clear task Function
function clearTasks(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

$(function () {
  $('#sortable').sortable();
});

render(lists);
