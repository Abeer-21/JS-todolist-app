let toDoTasks = [];
let currentEditingId = null;

const formElement = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoListElement = document.getElementById("todo-list");
const todoCounter = document.getElementById("todo-counter");
const notificationElement = document.getElementById("notification");

document.addEventListener("DOMContentLoaded", loadTasks);
formElement.addEventListener("submit", addOrUpdateTask);
document.getElementById("search-input").addEventListener("input", (e) => {
  filterTasks(e.target.value);
});

function addOrUpdateTask(event) {
  event.preventDefault();

  const newTodo = {
    id: new Date().getTime(),
    name: input.value,
    completed: false,
  };

  if (currentEditingId) {
    toDoTasks = toDoTasks.map((task) =>
      task.id === currentEditingId ? { ...newTodo, id: currentEditingId } : task
    );
    currentEditingId = null;
  } else {
    toDoTasks.push(newTodo);
  }

  localStorage.setItem("toDoTasks", JSON.stringify(toDoTasks));
  formElement.reset();
  renderToDo();
  updateTodoCounter();
}

function updateToDoItemById(id) {
  const taskToEdit = toDoTasks.find((task) => task.id === id);
  if (taskToEdit) {
    input.value = taskToEdit.name;
    currentEditingId = id;
  }
}

function deleteToDoItemById(id) {
  toDoTasks = toDoTasks.filter((task) => task.id !== id);
  localStorage.setItem("toDoTasks", JSON.stringify(toDoTasks));
  renderToDo();
  updateTodoCounter();
}

function renderToDo() {
  todoListElement.innerHTML = "";
  toDoTasks = JSON.parse(localStorage.getItem("toDoTasks")) || [];
  renderTodos(toDoTasks);
}

function renderTodos(todos) {
  const todoContainer = document.getElementById("todo-list");
  todoContainer.innerHTML = "";

  todos.forEach((todo) => {
    const li = document.createElement("li");

    const checkboxWrapper = document.createElement("div");
    checkboxWrapper.className = "checkbox-wrapper-12";

    const cbxDiv = document.createElement("div");
    cbxDiv.className = "cbx";

    const todoCheckbox = document.createElement("input");
    todoCheckbox.type = "checkbox";
    todoCheckbox.id = `cbx-${todo.id}`;
    todoCheckbox.checked = todo.completed;

    const label = document.createElement("label");
    label.setAttribute("for", todoCheckbox.id);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("fill", "none");
    svg.setAttribute("viewBox", "0 0 15 14");
    svg.setAttribute("height", "14");
    svg.setAttribute("width", "15");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M2 8.36364L6.23077 12L13 2");
    svg.appendChild(path);

    todoCheckbox.addEventListener("change", () => {
      todo.completed = todoCheckbox.checked;
      localStorage.setItem("toDoTasks", JSON.stringify(toDoTasks));
      renderToDo();
    });

    cbxDiv.appendChild(todoCheckbox);
    cbxDiv.appendChild(label);
    cbxDiv.appendChild(svg);
    checkboxWrapper.appendChild(cbxDiv);
    li.appendChild(checkboxWrapper);

    const todoText = document.createElement("span");
    todoText.textContent = todo.name;
    todoText.classList.add("todo-text");
    if (todo.completed) {
      todoText.style.textDecoration = "line-through";
    }
    li.appendChild(todoText);

    // Edit button
    const toDoUpdateButton = document.createElement("button");
    toDoUpdateButton.textContent = "Edit";
    toDoUpdateButton.classList.add("edit-btn");
    toDoUpdateButton.addEventListener("click", () =>
      updateToDoItemById(todo.id)
    );
    li.appendChild(toDoUpdateButton);

    // Delete button
    const toDoDeleteButton = document.createElement("button");
    toDoDeleteButton.textContent = "Delete";
    toDoDeleteButton.classList.add("delete-btn");
    toDoDeleteButton.addEventListener("click", () =>
      deleteToDoItemById(todo.id)
    );
    li.appendChild(toDoDeleteButton);

    todoContainer.appendChild(li);
  });
}

function filterTasks(searchQuery) {
  const filteredTasks = toDoTasks.filter((task) =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  renderTodos(filteredTasks);
}

function loadTasks() {
  toDoTasks = JSON.parse(localStorage.getItem("toDoTasks")) || [];
  renderToDo();
  updateTodoCounter();
}

function updateTodoCounter() {
  todoCounter.textContent = `Total Tasks: ${toDoTasks.length}`;
  todoCounter.classList.add("todo-counter");
}
