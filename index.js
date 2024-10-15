let toDoTasks = [];
const formElement = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoListElement = document.getElementById("todo-list");
const todoCounter = document.getElementById("todo-counter");
const notificationElement = document.getElementById("notification");
let currentEditingId = null;

// Add section
formElement.addEventListener("submit", (event) => {
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
  toDoTasks = toDoTasks.filter((task) => task.id !== id);
  localStorage.setItem("toDoTasks", JSON.stringify(toDoTasks));
  renderToDo();
  updateTodoCounter();
};

// Search section
function myFunction() {
  const input = document.getElementById("search-input").value.toUpperCase();
  const li = todoListElement.getElementsByTagName("li");

  for (let i = 0; i < li.length; i++) {
    const span = li[i].getElementsByTagName("span")[0];
    const txtValue = span.textContent || span.innerText;
    li[i].style.display =
      txtValue.toUpperCase().indexOf(input) > -1 ? "" : "none";
  }
}

// Render section
const renderToDo = () => {
  todoListElement.innerHTML = "";
  toDoTasks = JSON.parse(localStorage.getItem("toDoTasks")) || [];

  toDoTasks.forEach((task) => {
    const list = document.createElement("li");
    list.classList.add("todo-list");

    // Custom Checkbox Wrapper
    const checkboxWrapper = document.createElement("div");
    checkboxWrapper.className = "checkbox-wrapper-12";

    const cbxDiv = document.createElement("div");
    cbxDiv.className = "cbx";

    const todoCheckbox = document.createElement("input");
    todoCheckbox.type = "checkbox";
    todoCheckbox.id = `cbx-${task.id}`;
    todoCheckbox.checked = task.completed;

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

    // Add event listener for checkbox change
    todoCheckbox.addEventListener("change", () => {
      list.classList.toggle("completed", todoCheckbox.checked);
      notificationElement.textContent = todoCheckbox.checked
        ? "Good job!!"
        : "";
      if (todoCheckbox.checked) {
        setTimeout(() => {
          notificationElement.textContent = " ";
        }, 2000);
      }
    });

    // Append elements to the checkbox wrapper
    cbxDiv.appendChild(todoCheckbox);
    cbxDiv.appendChild(label);
    cbxDiv.appendChild(svg);
    checkboxWrapper.appendChild(cbxDiv);
    list.appendChild(checkboxWrapper);

    // Todo text
    const todoText = document.createElement("span");
    todoText.textContent = task.name;
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
    toDoDeleteButton.textContent = "Delete";
    toDoDeleteButton.classList.add("delete-btn");
    toDoDeleteButton.addEventListener("click", () =>
      deleteToDoItemById(task.id)
    );
    list.appendChild(toDoDeleteButton);

    todoListElement.appendChild(list);
  });
};

// Update total task counter
const updateTodoCounter = () => {
  todoCounter.textContent = `Total Tasks: ${toDoTasks.length}`;
  todoCounter.classList.add("todo-counter");
};

// Load tasks from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
  toDoTasks = JSON.parse(localStorage.getItem("toDoTasks")) || [];
  renderToDo();
  updateTodoCounter();
});
