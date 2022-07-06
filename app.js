// Форма
// Список задач
const tasks = [
  {
    _id: "5d2ca9e2e03d40b326596aa7",
    completed: false,
    body: "Описание задачи",
    title: "Задача 1",
  },
  {
    _id: "5d2ca9e29c8a94095c1288e0",
    completed: false,
    body: "Описание задачи",
    title: "Задача 2",
  },
  {
    _id: "5d2ca9e2e03d40b3232496aa7",
    completed: false,
    body: "Описание задачи",
    title: "Задача 3",
  },
  {
    _id: "5d2ca9e29c8a94095564788e0",
    completed: false,
    body: "Описание задачи",
    title: "Задача 4",
  },
];

(function (arrOfTasks) {
  const objOfTasks = arrOfTasks.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {});

  const themes = {
    default: {
      "--base-text-color": "#212529",
      "--background-color-body": "#CFD8DC",
      "--header-bg": "#007bff",
      "--header-text-color": "#fff",
      "--default-btn-bg": "#007bff",
      "--default-btn-text-color": "#fff",
      "--default-btn-hover-bg": "#0069d9",
      "--default-btn-border-color": "#0069d9",
      "--danger-btn-bg": "#dc3545",
      "--danger-btn-text-color": "#fff",
      "--danger-btn-hover-bg": "#bd2130",
      "--danger-btn-border-color": "#dc3545",
      "--input-border-color": "#ced4da",
      "--input-bg-color": "#fff",
      "--input-text-color": "#495057",
      "--input-focus-bg-color": "#fff",
      "--input-focus-text-color": "#495057",
      "--input-focus-border-color": "#80bdff",
      "--input-focus-box-shadow": "0 0 0 0.2rem rgba(0, 123, 255, 0.25)",
    },
    dark: {
      "--base-text-color": "#212529",
      "--background-color-body": "#B0BEC5",
      "--header-bg": "#343a40",
      "--header-text-color": "#fff",
      "--default-btn-bg": "#58616b",
      "--default-btn-text-color": "#fff",
      "--default-btn-hover-bg": "#292d31",
      "--default-btn-border-color": "#343a40",
      "--default-btn-focus-box-shadow":
        "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
      "--danger-btn-bg": "#b52d3a",
      "--danger-btn-text-color": "#fff",
      "--danger-btn-hover-bg": "#88222c",
      "--danger-btn-border-color": "#88222c",
      "--input-border-color": "#ced4da",
      "--input-bg-color": "#fff",
      "--input-text-color": "#495057",
      "--input-focus-bg-color": "#fff",
      "--input-focus-text-color": "#495057",
      "--input-focus-border-color": "#78818a",
      "--input-focus-box-shadow": "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
    },
    light: {
      "--base-text-color": "#212529",
      "--background-color-body": "#FFFFFF",
      "--header-bg": "#fff",
      "--header-text-color": "#212529",
      "--default-btn-bg": "#fff",
      "--default-btn-text-color": "#212529",
      "--default-btn-hover-bg": "#e8e7e7",
      "--default-btn-border-color": "#343a40",
      "--default-btn-focus-box-shadow":
        "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
      "--danger-btn-bg": "#f1b5bb",
      "--danger-btn-text-color": "#212529",
      "--danger-btn-hover-bg": "#ef808a",
      "--danger-btn-border-color": "#e2818a",
      "--input-border-color": "#ced4da",
      "--input-bg-color": "#fff",
      "--input-text-color": "#495057",
      "--input-focus-bg-color": "#fff",
      "--input-focus-text-color": "#495057",
      "--input-focus-border-color": "#78818a",
      "--input-focus-box-shadow": "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
    },
  };
  let lastSelectedTheme = localStorage.getItem("app_theme") || "default";

  // Elemnts UI
  const listContainer = document.querySelector(".list-group");
  const form = document.forms["addTask"];
  const inputTitle = form.elements["title"];
  const inputBody = form.elements["body"];
  const container = document.querySelector(".tasks-list-section .container");
  const emptyList = document.createElement("div");
  const outstandingBtn = document.querySelector(".btn-outstanding");
  const allTaskBtn = document.querySelector(".btn-all-tasks");
  const themeSelect = document.getElementById("themeSelect");

  // Events
  setTheme(lastSelectedTheme);
  renderAllTasks(objOfTasks);
  form.addEventListener("submit", onFormSubmitHandler);
  listContainer.addEventListener("click", onDeletehandler);
  listContainer.addEventListener("click", onCompleteHandler);
  outstandingBtn.addEventListener("click", onShowOutstandingTasksHandler);
  allTaskBtn.addEventListener("click", onShowAllTasksHandler);
  themeSelect.addEventListener("change", onThemeSelectHandler);

  function renderAllTasks(tasksList) {
    if (!tasksList) {
      console.error("Передайте список задач!");
      return;
    }

    const fragment = document.createDocumentFragment();
    Object.values(tasksList).forEach((task) => {
      const li = listItemTemplate(task);
      fragment.appendChild(li);
    });
    listContainer.appendChild(fragment);
    isEmptyList();
    completedTask();
  }

  function listItemTemplate({ _id, title, body } = {}) {
    const li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "d-flex",
      "align-items-center",
      "flex-wrap",
      "mt-2"
    );
    li.setAttribute("data-task-id", _id);

    const span = document.createElement("span");
    span.textContent = title;
    span.style.fontWeight = "bold";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete task";
    deleteBtn.classList.add("btn", "btn-danger", "ml-auto", "delete-btn");

    const article = document.createElement("p");
    article.textContent = body;
    article.classList.add("mt-2", "w-100");

    const completeBtn = document.createElement("button");
    completeBtn.textContent = "Done";
    completeBtn.classList.add("btn", "btn-primary", "ml-auto", "completed-btn");

    li.appendChild(span);
    li.appendChild(deleteBtn);
    li.appendChild(article);
    li.appendChild(completeBtn);

    return li;
  }

  function onFormSubmitHandler(e) {
    e.preventDefault();
    const titleValue = inputTitle.value;
    const bodyValue = inputBody.value;

    if (!titleValue || !bodyValue) {
      alert("Пожалуйста введите title и body");
      return;
    }

    const task = createNewTask(titleValue, bodyValue);
    arrOfTasks.push(task);
    const listItem = listItemTemplate(task);
    listContainer.insertAdjacentElement("afterbegin", listItem);
    form.reset();
    emptyList.remove();
  }

  function createNewTask(title, body) {
    const newTask = {
      title,
      body,
      completed: false,
      _id: `task-${Math.random()}`,
    };

    objOfTasks[newTask._id] = newTask;

    return { ...newTask };
  }

  function deleteTask(id) {
    const { title } = objOfTasks[id];
    const isConfirm = confirm(`Точно вы хотите удалить задачу: ${title}`);
    if (!isConfirm) return isConfirm;
    delete objOfTasks[id];
    return isConfirm;
  }

  function deleteTaskFromHtml(confirmed, el) {
    if (!confirmed) return;
    el.remove();
  }

  function onDeletehandler({ target }) {
    if (target.classList.contains("delete-btn")) {
      const parent = target.closest("[data-task-id]");
      const id = parent.dataset.taskId;
      const confirmed = deleteTask(id);
      deleteTaskFromHtml(confirmed, parent);
      isEmptyList();
    }
  }

  function isEmptyList() {
    if (listContainer.children.length) return;
    emptyList.textContent = "List of task is empty";
    emptyList.classList.add("text-center", "text-info", "mt-2", "fs-1");
    emptyList.style.fontWeight = "bold";
    emptyList.style.fontSize = "2em";
    container.appendChild(emptyList);
    return emptyList;
  }

  function isCompleted({ _id, completed }) {
    if (completed) {
      const element = document.querySelector(`[data-task-id='${_id}']`);
      element.setAttribute("style", "background-color: #0275d833");
    }
  }

  function completedTask() {
    arrOfTasks.forEach((task) => {
      isCompleted(task);
    });
  }

  function onCompleteHandler({ target }) {
    if (target.classList.contains("completed-btn")) {
      const parent = target.closest("[data-task-id]");
      const id = parent.dataset.taskId;
      objOfTasks[id].completed = true;
      for (let task of arrOfTasks) {
        if (task._id === id) {
          task.completed = true;
        }
      }
      isCompleted(objOfTasks[id]);
    }
  }

  function onShowOutstandingTasksHandler() {
    changeDisplay("d-none", "d-flex");
    allTaskBtn.classList.remove("active");
    outstandingBtn.classList.add("active");
  }

  function onShowAllTasksHandler() {
    changeDisplay("d-flex", "d-none");
    allTaskBtn.classList.add("active");
    outstandingBtn.classList.remove("active");
  }

  function changeDisplay(displayAdd, displayRemove) {
    arrOfTasks.forEach((task) => {
      if (task.completed) {
        const element = document.querySelector(`[data-task-id='${task._id}']`);
        element.classList.add(displayAdd);
        element.classList.remove(displayRemove);
      }
    });
  }

  function onThemeSelectHandler(e) {
    const selectedTheme = themeSelect.value;
    const isConfirmed = confirm(
      `Вы действительно хотите изменить тему: ${selectedTheme}`
    );
    if (!isConfirmed) {
      themeSelect.value = lastSelectedTheme;
      return;
    }
    setTheme(selectedTheme);
    lastSelectedTheme = selectedTheme;
    localStorage.setItem("app_theme", selectedTheme);
  }

  function setTheme(name) {
    const selectedThemObj = themes[name];
    Object.entries(selectedThemObj).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }
})(tasks);



