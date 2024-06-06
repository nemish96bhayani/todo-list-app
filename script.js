document.addEventListener('DOMContentLoaded', () => {
    const taskPopup = document.getElementById('taskPopup');
    const closePopup = document.getElementById('closePopup');
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const addTaskButton = document.getElementById('addTaskButton');
    const searchBar = document.getElementById('searchBar');
    const deleteAllButton = document.getElementById('deleteAllButton');
    const filterAllOption = document.getElementById('filterAllOption');
    const filterPendingOption = document.getElementById('filterPendingOption');
    const filterCompletedOption = document.getElementById('filterCompletedOption');
    const editPopup = document.getElementById('editPopup');
    const closeEditPopup = document.getElementById('closeEditPopup');
    const editTaskForm = document.getElementById('editTaskForm');
    const confirmationMessage = document.getElementById('confirmationMessage');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let editingTaskId = null;
    let filterOption = 'all';

    function showConfirmationMessage(message) {
        confirmationMessage.textContent = message;
        confirmationMessage.style.display = 'block';
        setTimeout(() => {
            confirmationMessage.style.display = 'none';
        }, 3000);
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filter === 'completed') return task.completed;
            if (filter === 'pending') return !task.completed;
            return true;
        });

        filteredTasks.forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.className = `task-card ${task.completed ? 'task-done' : ''}`;
            taskCard.innerHTML = `
                <h3 class="task-title">${task.title}</h3>
                <p class="task-description">${task.description}</p>
                <p class="timestamp">Created at: ${task.createdAt}</p>
                <div class="task-buttons">
                    <button class="edit-button">Edit</button>
                    <button class="delete-button">Delete</button>
                    <button class="toggle-status-button">${task.completed ? 'Mark as Pending' : 'Mark as Completed'}</button>
                </div>
            `;

            taskList.appendChild(taskCard);

            const editButton = taskCard.querySelector('.edit-button');
            const deleteButton = taskCard.querySelector('.delete-button');
            const toggleStatusButton = taskCard.querySelector('.toggle-status-button');

            editButton.addEventListener('click', () => openEditPopup(task.id));
            deleteButton.addEventListener('click', () => deleteTask(task.id));
            toggleStatusButton.addEventListener('click', () => toggleTaskStatus(task.id));
        });
    }

    function addTask(title, description) {
        const newTask = {
            id: Date.now(),
            title,
            description,
            createdAt: new Date().toLocaleString(),
            completed: false
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks(filterOption);
        showConfirmationMessage('Task added successfully!');
    }

    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks(filterOption);
        showConfirmationMessage('Task deleted successfully!');
    }

    function toggleTaskStatus(taskId) {
        const task = tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks(filterOption);
            showConfirmationMessage('Task status updated successfully!');
        }
    }

    function openEditPopup(taskId) {
        const task = tasks.find(task => task.id === taskId);
        if (task) {
            editingTaskId = taskId;
            document.getElementById('editTaskTitle').value = task.title;
            document.getElementById('editTaskDescription').value = task.description;
            editPopup.style.display = 'flex';
        }
    }

    function editTask(title, description) {
        const task = tasks.find(task => task.id === editingTaskId);
        if (task) {
            task.title = title;
            task.description = description;
            saveTasks();
            renderTasks(filterOption);
            showConfirmationMessage('Task updated successfully!');
        }
    }

    taskForm.addEventListener('submit', event => {
        event.preventDefault();
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        addTask(title, description);
        taskPopup.style.display = 'none';
        taskForm.reset();
    });

    addTaskButton.addEventListener('click', () => {
        taskPopup.style.display = 'flex';
    });

    closePopup.addEventListener('click', () => {
        taskPopup.style.display = 'none';
    });

    searchBar.addEventListener('input', event => {
        const searchText = event.target.value.toLowerCase();
        const filteredTasks = tasks.filter(task => 
            task.title.toLowerCase().includes(searchText) || 
            task.description.toLowerCase().includes(searchText)
        );
        taskList.innerHTML = '';
        filteredTasks.forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.className = `task-card ${task.completed ? 'task-done' : ''}`;
            taskCard.innerHTML = `
                <h3 class="task-title">${task.title}</h3>
                <p class="task-description">${task.description}</p>
                <p class="timestamp">Created at: ${task.createdAt}</p>
                <div class="task-buttons">
                    <button class="edit-button">Edit</button>
                    <button class="delete-button">Delete</button>
                    <button class="toggle-status-button">${task.completed ? 'Mark as Pending' : 'Mark as Completed'}</button>
                </div>
            `;

            taskList.appendChild(taskCard);

            const editButton = taskCard.querySelector('.edit-button');
            const deleteButton = taskCard.querySelector('.delete-button');
            const toggleStatusButton = taskCard.querySelector('.toggle-status-button');

            editButton.addEventListener('click', () => openEditPopup(task.id));
            deleteButton.addEventListener('click', () => deleteTask(task.id));
            toggleStatusButton.addEventListener('click', () => toggleTaskStatus(task.id));
        });
    });

    deleteAllButton.addEventListener('click', () => {
        tasks = [];
        saveTasks();
        renderTasks(filterOption);
        showConfirmationMessage('All tasks deleted successfully!');
    });

    filterAllOption.addEventListener('click', () => {
        filterOption = 'all';
        renderTasks(filterOption);
    });

    filterPendingOption.addEventListener('click', () => {
        filterOption = 'pending';
        renderTasks(filterOption);
    });

    filterCompletedOption.addEventListener('click', () => {
        filterOption = 'completed';
        renderTasks(filterOption);
    });

    editTaskForm.addEventListener('submit', event => {
        event.preventDefault();
        const title = document.getElementById('editTaskTitle').value;
        const description = document.getElementById('editTaskDescription').value;
        editTask(title, description);
        editPopup.style.display = 'none';
        editTaskForm.reset();
    });

    closeEditPopup.addEventListener('click', () => {
        editPopup.style.display = 'none';
    });

    renderTasks(filterOption);
});
