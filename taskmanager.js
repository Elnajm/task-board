let tasks = [];
let nextId = 1;

const taskCounter = document.getElementById('task-counter');
const modalOverlay = document.getElementById('modal-overlay');
const modalTitleEl = document.getElementById('modal-title');
const titleInput = document.getElementById('modal-title-input');
const descInput = document.getElementById('modal-desc');
const priorityInput = document.getElementById('modal-priority');
const dueInput = document.getElementById('modal-due');
const priorityFilter = document.getElementById('priority-filter');

let currentColumn = null;
let editingTaskId = null;

function createTaskCard(taskObj) {
  const li = document.createElement('li');
  li.setAttribute('data-id', taskObj.id);
  li.setAttribute('data-priority', taskObj.priority);
  li.classList.add('task-card');

  const title = document.createElement('span');
  title.classList.add('card-title');
  title.textContent = taskObj.title;

  const desc = document.createElement('p');
  desc.classList.add('card-desc');
  desc.textContent = taskObj.description;

  const badge = document.createElement('span');
  badge.classList.add('priority-badge', taskObj.priority);
  badge.textContent = taskObj.priority;

  const due = document.createElement('span');
  due.classList.add('card-due');
  due.textContent = taskObj.due ? 'Due: ' + taskObj.due : '';

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.setAttribute('data-action', 'edit');
  editBtn.setAttribute('data-id', taskObj.id);

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.setAttribute('data-action', 'delete');
  deleteBtn.setAttribute('data-id', taskObj.id);

  const actions = document.createElement('div');
  actions.classList.add('card-actions');
  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(title);
  li.appendChild(desc);
  li.appendChild(badge);
  li.appendChild(due);
  li.appendChild(actions);

  return li;
}

function addTask(columnId, taskObj) {
  tasks.push(taskObj);
  const list = document.getElementById(columnId + '-list');
  const card = createTaskCard(taskObj);
  list.appendChild(card);
  updateCounter();
}

function updateCounter() {
  taskCounter.textContent = tasks.length + ' tasks';
}

function deleteTask(taskId) {
  const card = document.querySelector('[data-id="' + taskId + '"]');
  card.classList.add('fade-out');
  card.addEventListener('transitionend', function () {
    card.remove();
    tasks = tasks.filter(function (t) { return t.id !== taskId; });
    updateCounter();
  });
}

function editTask(taskId) {
  const task = tasks.find(function (t) { return t.id === taskId; });
  if (!task) return;
  editingTaskId = taskId;
  modalTitleEl.textContent = 'Edit Task';
  titleInput.value = task.title;
  descInput.value = task.description;
  priorityInput.value = task.priority;
  dueInput.value = task.due;
  modalOverlay.classList.remove('hidden');
}

function updateTask(taskId, updatedData) {
  const taskIndex = tasks.findIndex(function (t) { return t.id === taskId; });
  if (taskIndex === -1) return;
  tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData };
  const oldCard = document.querySelector('[data-id="' + taskId + '"]');
  const newCard = createTaskCard(tasks[taskIndex]);
  oldCard.replaceWith(newCard);
}

document.querySelectorAll('.add-task-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentColumn = btn.getAttribute('data-column');
    editingTaskId = null;
    modalTitleEl.textContent = 'Add Task';
    titleInput.value = '';
    descInput.value = '';
    priorityInput.value = 'medium';
    dueInput.value = '';
    modalOverlay.classList.remove('hidden');
  });
});

document.getElementById('modal-cancel-btn').addEventListener('click', () => {
  modalOverlay.classList.add('hidden');
});

document.getElementById('modal-save-btn').addEventListener('click', () => {
  const taskData = {
    title: titleInput.value,
    description: descInput.value,
    priority: priorityInput.value,
    due: dueInput.value
  };

  if (editingTaskId) {
    updateTask(editingTaskId, taskData);
  } else {
    taskData.id = nextId++;
    addTask(currentColumn, taskData);
  }
  modalOverlay.classList.add('hidden');
});

document.addEventListener('click', (e) => {
  const action = e.target.getAttribute('data-action');
  const id = parseInt(e.target.getAttribute('data-id'));
  if (action === 'delete') {
    deleteTask(id);
  } else if (action === 'edit') {
    editTask(id);
  }
});

priorityFilter.addEventListener('change', () => {
  const filterValue = priorityFilter.value;
  document.querySelectorAll('.task-card').forEach(card => {
    if (filterValue === 'all' || card.getAttribute('data-priority') === filterValue) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
});

document.getElementById('clear-done-btn').addEventListener('click', () => {
  const doneCards = document.querySelectorAll('#done-list .task-card');
  doneCards.forEach((card, index) => {
    setTimeout(() => {
      const id = parseInt(card.getAttribute('data-id'));
      deleteTask(id);
    }, index * 100);
  });
});