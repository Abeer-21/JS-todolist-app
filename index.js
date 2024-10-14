let toDoTasks = [];
const formElement = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoListElement = document.getElementById("todo-list");
const todoCounter = document.getElementById("todo-counter");
const notificationElemen = document.getElementById("notification");
let currentEditingId = null;

// Add section
formElement.addEventListener("submit", (event) => {
  event.preventDefault();

  const newTodo = {
    id: new Date().getTime(),
    name: input.value,
  };

  if(currentEditingId)
  {
    toDoTasks = toDoTasks.map((task) =>
      task.id === currentEditingId ? newTodo : task
    );
    currentEditingId = null;
  } 
  else 
  {
    toDoTasks.push(newTodo);
  }

  localStorage.setItem("toDoTasks", JSON.stringify(toDoTasks));
  input.value = "";
  renderToDo();
  updateTodoCounter();
});

// Edit section
const updateToDoItemById = (id) => {
  const taskToEdit = toDoTasks.find((task) => task.id === id);
  if (taskToEdit) {
    input.value = taskToEdit.name; 
    currentEditingId = id;
  }
};

// Delete section
const deleteToDoItemById = (id) => {
  const filterToDo = toDoTasks.filter((task) => task.id !== id);
  localStorage.setItem("toDoTasks", JSON.stringify(filterToDo));
  renderToDo();
  updateTodoCounter();
};

// Render section
const renderToDo = () => {
  todoListElement.innerHTML = "";
  toDoTasks = JSON.parse(localStorage.getItem("toDoTasks")) || [];

  toDoTasks.map((task) => {
    const list = document.createElement("li");
    list.classList.add("todo-list");

    //checkbox
    const todoCheckbox = document.createElement("input");
    todoCheckbox.type = "checkbox"; 
    todoCheckbox.id = `todo-${task.id}`;

    todoCheckbox.addEventListener("change", () => {
      if (todoCheckbox.checked) {
        list.classList.add("completed");
        notificationElemen.textContent = "Good job!!";
        setTimeout(() => {
          notificationElemen.textContent = " ";
        }, 2000);
      } else {
        list.classList.remove("completed");
      }
    });

    list.appendChild(todoCheckbox);

    const todoText = document.createElement("span");
    todoText.textContent = `${task.name}`;
    todoText.classList.add("todo-text");
    list.appendChild(todoText);

    // Edit button
    const toDoUpdateButton = document.createElement("button");
    toDoUpdateButton.textContent = "Edit";
    toDoUpdateButton.classList.add("edit-btn");
    toDoUpdateButton.addEventListener("click", () =>
      updateToDoItemById(task.id)
    );

    list.appendChild(toDoUpdateButton);

    // Delete button
    const toDoDeleteButton = document.createElement("button");
    toDoDeleteButton.textContent = `Delete`;
    toDoDeleteButton.classList.add("delete-btn");
    toDoDeleteButton.addEventListener("click", () =>
      deleteToDoItemById(task.id)
    );

    list.appendChild(toDoDeleteButton);
    todoListElement.appendChild(list);
  });
};

const updateTodoCounter = () => {
  todoCounter.textContent = `Total Tasks: ${toDoTasks.length}`;
  todoCounter.classList.add("todo-counter");
};

document.addEventListener("DOMContentLoaded", () => {
  renderToDo();
  updateTodoCounter();
});
