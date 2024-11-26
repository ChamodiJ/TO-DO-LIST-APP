// DOM Elements
const wrapper = document.querySelector(".wrapper");
const backBtn = document.querySelector(".back-btn");
const menuBtn = document.querySelector(".menu-btn");
const addTaskBtn = document.querySelector(".add-task-btn");
const addTaskForm = document.querySelector(".add-task");
const blackBackdrop = document.querySelector(".black-backdrop");
const categoriesContainer = document.querySelector(".categories");
const categoryTitle = document.querySelector(".category-title");
const totalCategoryTasks = document.querySelector(".category-tasks");
const categoryImg = document.querySelector("#category-img");
const totalTasks = document.querySelector(".totalTasks");
const tasksContainer = document.querySelector(".tasks");
const categorySelect = document.querySelector("#category-select");
const cancelBtn = document.querySelector(".cancel-btn");
const addBtn = document.querySelector(".add-btn");
const taskInput = document.querySelector("#task-input");

// State Variables
let categories = [
  { title: "Personal", img: "abc.png" },
  { title: "Work", img: "briefcase.png" },
  { title: "Shopping", img: "shopping.png" },
  { title: "Coding", img: "web-design.png" },
  { title: "Health", img: "Health.png" },
  { title: "Fitness", img: "dumbbell.png" },
  { title: "Education", img: "Edu.png" },
  { title: "Finance", img: "saving.png" },
];

let tasks = [
  // Example tasks
  { id: 1, task: "Buy groceries", category: "Shopping", completed: false },
  { id: 2, task: "Complete project report", category: "Work", completed: false },
];

let selectedCategory = categories[0];

// Functions
const toggleScreen = () => {
  wrapper.classList.toggle("show-category");
};

const toggleAddTaskForm = () => {
  addTaskForm.classList.toggle("active");
  blackBackdrop.classList.toggle("active");
  addTaskBtn.classList.toggle("active");
};

const calculateTotal = () => {
  const categoryTasks = tasks.filter(
    (task) => task.category.toLowerCase() === selectedCategory.title.toLowerCase()
  );
  totalCategoryTasks.innerHTML = `${categoryTasks.length} Tasks`;
  totalTasks.innerHTML = tasks.length;
};

const renderCategories = () => {
  categoriesContainer.innerHTML = "";
  categories.forEach((category) => {
    const categoryTasks = tasks.filter(
      (task) => task.category.toLowerCase() === category.title.toLowerCase()
    );
    const div = document.createElement("div");
    div.classList.add("category");
    div.addEventListener("click", () => {
      wrapper.classList.toggle("show-category");
      selectedCategory = category;
      categoryTitle.innerHTML = category.title;
      categoryImg.src = `images/${category.img}`;
      calculateTotal();
      renderTasks();
    });
    div.innerHTML = `
      <div class="left">
        <img src="images/${category.img}" alt="${category.title}" />
        <div class="content">
          <h1>${category.title}</h1>
          <p>${categoryTasks.length} Tasks</p>
        </div>
      </div>
      <div class="options">
        <div class="toggle-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 110 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 110 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 110 1.5z" />
          </svg>
        </div>
      </div>
    `;
    categoriesContainer.appendChild(div);
  });
};

const renderTasks = () => {
  tasksContainer.innerHTML = "";
  const categoryTasks = tasks.filter(
    (task) => task.category.toLowerCase() === selectedCategory.title.toLowerCase()
  );
  if (categoryTasks.length === 0) {
    tasksContainer.innerHTML = `<p class="no-tasks">No tasks added for this category</p>`;
  } else {
    categoryTasks.forEach((task) => {
      const div = document.createElement("div");
      div.classList.add("task-wrapper");
      div.innerHTML = `
        <label class="task" for="task-${task.id}">
          <input type="checkbox" id="task-${task.id}" ${task.completed ? "checked" : ""} />
          <span class="checkmark">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </span>
          <p>${task.task}</p>
        </label>
        <div class="delete">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 3L9 4m6-1v1M4 7h16m-2 0v10a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z" />
          </svg>
        </div>
      `;
      const checkbox = div.querySelector("input[type='checkbox']");
      checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        saveLocal();
      });
      const deleteBtn = div.querySelector(".delete");
      deleteBtn.addEventListener("click", () => {
        tasks = tasks.filter((t) => t.id !== task.id);
        saveLocal();
        renderTasks();
        calculateTotal();
      });
      tasksContainer.appendChild(div);
    });
  }
};

const saveLocal = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const getLocal = () => {
  const localTasks = JSON.parse(localStorage.getItem("tasks"));
  if (localTasks) {
    tasks = localTasks;
  }
};

// Event Listeners
menuBtn.addEventListener("click", toggleScreen);
backBtn.addEventListener("click", toggleScreen);
addTaskBtn.addEventListener("click", toggleAddTaskForm);
blackBackdrop.addEventListener("click", toggleAddTaskForm);
cancelBtn.addEventListener("click", toggleAddTaskForm);
addBtn.addEventListener("click", () => {
  const task = taskInput.value;
  const category = categorySelect.value;
  if (!task) {
    alert("Please enter a task");
    return;
  }
  const newTask = {
    id: tasks.length + 1,
    task,
    category,
    completed: false,
  };
  tasks.push(newTask);
  taskInput.value = "";
  saveLocal();
  toggleAddTaskForm();
  renderTasks();
  calculateTotal();
});

// Populate categories in the form
categories.forEach((category) => {
  const option = document.createElement("option");
  option.value = category.title;
  option.textContent = category.title;
  categorySelect.appendChild(option);
});

// Initialize
getLocal();
calculateTotal();
renderCategories();
renderTasks();
