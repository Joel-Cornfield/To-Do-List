import Icon from '../assets/icon.png';
import ProjectManager from './projects';
import TodoManager, { Todo } from './todos';

export default class Layout {
    constructor(userData, todoManager, projectManager) {
        this.userData = userData;
        this.activeProjectId = null;
        this.todoManager = todoManager;
        this.projectManager = projectManager;
    }

    createHeader() {
        const header = document.createElement('header');
        header.className = 'app-header';
    
        header.innerHTML = `
            <div class="header-left">
                <button class="menu-toggle" aria-label="Toggle Menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <h1 class="app-title">
                    <img src="${Icon}" alt="Todo Icon" class="todo-icon" />
                    <span class="todo">ToDo</span><span class="list">List</span>
                </h1>
            </div>
            <div class="header-right">
                <div class="user-profile">
                    <span class="user-name">${this.userData.name}</span>
                    <div class="user-avatar">
                        ${this.createAvatarElement()}
                    </div>
                    <div class="user-dropdown" style="display: none;">
                        <div class="dropdown-item about">About</div>
                        <div class="dropdown-item sign-out">Sign Out</div>
                    </div>
                </div>
            </div>
        `;
    
        return header;
    }
    

    createSidebar() {
        const sidebar = document.createElement('aside');
        sidebar.className = 'app-sidebar';

        sidebar.innerHTML = `
            <nav class="sidebar-nav">
                <div class="sidebar-section">
                    <h2>Home</h2>
                    <ul>
                        <li><a href="#" class="active" data-view="all">All Tasks</a></li>
                        <li><a href="#" data-view="today">Today</a></li>
                        <li><a href="#" data-view="upcoming">Upcoming</a></li>
                        <li><a href="#" data-view="completed">Completed</a></li>
                    </ul>
                </div>
                <div class="sidebar-section">
                    <h2>Projects</h2>
                    <ul class="projects-list">
                    </ul>
                    <button class="btn-add-project" id="add-project-btn">+ Add Project</button>
                    <div class="add-project-form" style="display: none;">
                        <input type="text" class="add-project-input" placeholder="Project name">
                        <div class="project-actions">
                            <button class="btn-add-project" id="save-project-btn">Add</button>
                            
                        </div>
                    </div>
                </div>
            </nav>
        `;

        return sidebar;
    }

    createMain() {
        const main = document.createElement('main');
        main.className = 'app-main';

        main.innerHTML = `
            <div class="content-header">
                <h2>All Tasks</h2>
                <button class="add-task-btn">+ Add Task</button>
            </div>
            <div class="tasks-container">
            </div>
        `;

        return main;
    }

    createAvatarElement() {
        if (this.userData.avatar === 'default') {
            const initials = this.userData.name
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
            return `<div class="default-avatar"><span>${initials}</span></div>`;
        }
        return `<div class="user-avatar-img" style="background-image: url(${this.userData.avatar})"></div>`;
    }

    createTodoModal(todoToEdit = null) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        
        const projects = this.projectManager.getAllProjects();
        const projectOptions = projects
            .map(project => `
                <option value="${project.id}" ${project.id === (todoToEdit?.projectId || this.activeProjectId) ? 'selected' : ''}>
                    ${project.name}
                </option>
            `)
            .join('');
        
        modal.innerHTML = `
            <div class="todo-modal">
                <h2>${todoToEdit ? 'Edit Task' : 'Add New Task'}</h2>
                <form class="todo-form">
                    <div class="form-group">
                        <label for="todo-title">Title</label>
                        <input type="text" id="todo-title" value="${todoToEdit?.title || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="todo-project">Project</label>
                        <select id="todo-project" required>
                            ${projectOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="todo-description">Description</label>
                        <textarea id="todo-description" rows="3">${todoToEdit?.description || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="todo-due-date">Due Date</label>
                        <input type="date" id="todo-due-date" value="${todoToEdit?.dueDate || ''}">
                    </div>
                    <div class="form-group">
                        <label for="todo-priority">Priority</label>
                        <select id="todo-priority">
                            <option value="low" ${todoToEdit?.priority === 'low' ? 'selected' : ''}>Low</option>
                            <option value="medium" ${!todoToEdit || todoToEdit?.priority === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="high" ${todoToEdit?.priority === 'high' ? 'selected' : ''}>High</option>
                        </select>
                    </div>
                    <div class="todo-actions">
                        <button type="submit" class="btn-todo btn-primary">
                            ${todoToEdit ? 'Update' : 'Add Task'}
                        </button>
                        ${todoToEdit ? '<button type="button" class="btn-todo btn-danger" id="delete-todo">Delete</button>' : ''}
                        <button type="button" class="btn-todo btn-secondary" id="cancel-todo">Cancel</button>
                    </div>
                </form>
            </div>
        `;
    
        return modal;
    }

    showTodoModal(todoToEdit = null, projectId = null) {
        const modal = this.createTodoModal(todoToEdit);
        document.body.appendChild(modal);
    
        const form = modal.querySelector('.todo-form');
        const cancelButton = modal.querySelector('#cancel-todo');
        const deleteButton = modal.querySelector('#delete-todo');
    
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const title = document.getElementById('todo-title').value;
            const description = document.getElementById('todo-description').value;
            const dueDate = document.getElementById('todo-due-date').value;
            const priority = document.getElementById('todo-priority').value;
            const selectedProjectId = document.getElementById('todo-project').value;
    
            if (title.trim()) {
                if (todoToEdit) {
                    todoToEdit.title = title;
                    todoToEdit.description = description;
                    todoToEdit.dueDate = dueDate;
                    todoToEdit.priority = priority;
                    this.todoManager.updateTodo(projectId, todoToEdit.id, todoToEdit);
                } else {
                    const todo = new Todo(title, description, dueDate, priority);
                    this.todoManager.addTodo(selectedProjectId, todo);
                }
                this.renderCurrentView();
                document.body.removeChild(modal);
            }
        });
    
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    
        if (deleteButton) {
            deleteButton.addEventListener('click', () => {
                this.todoManager.deleteTodo(projectId, todoToEdit.id);
                this.renderCurrentView();
                document.body.removeChild(modal);
            });
        }
    }

    showSignOutConfirmation() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        
        modal.innerHTML = `
            <div class="todo-modal">
                <h2>Sign Out</h2>
                <p>Are you sure you want to sign out? This will clear all your data...</p>
                <p style="font-size: 0.9em; color: #666; margin-top: 0.5rem;">
                    (Yes, this is just for testing. In a real app, your data would be saved!)
                </p>
                <div class="todo-actions" style="margin-top: 2rem;">
                    <button class="btn-todo btn-primary" id="confirm-signout">Sign Out</button>
                    <button class="btn-todo btn-secondary" id="cancel-signout">Cancel</button>
                </div>
            </div>
        `;
    
        document.body.appendChild(modal);
    
        const confirmBtn = modal.querySelector('#confirm-signout');
        const cancelBtn = modal.querySelector('#cancel-signout');
    
        confirmBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.reload();
        });
    
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    showAboutModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        
        modal.innerHTML = `
            <div class="todo-modal">
                <h2>About ToDoList</h2>
                <div class="about-content">
                    <p>ToDoList is a project management application built as part of The Odin Project curriculum. It's designed to help organize projects and tasks.</p>
                    
                   <p class="features-text">Features include:</p>
                    <ul>
                        <li>Project organization</li>
                        <li>Task management with priorities and due dates</li>
                        <li>Different task views (Today, Upcoming, Completed)</li>
                    </ul>
                    
                    <p class="signature">
                        Joel Cornfield
                    </p>
                </div>
                <div class="todo-actions">
                    <button class="btn-todo btn-primary" id="close-about">Close</button>
                </div>
            </div>
        `;
    
        document.body.appendChild(modal);
    
        const closeBtn = modal.querySelector('#close-about');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    renderTodos(view = 'all') {
        const tasksContainer = document.querySelector('.tasks-container');
        let todos;
    
        switch(view) {
            case 'today':
                todos = this.todoManager.getTodayTodos();
                break;
            case 'upcoming':
                todos = this.todoManager.getUpcomingTodos();
                break;
            case 'completed':
                todos = this.todoManager.getCompletedTodos();
                break;
            default:
                if (this.activeProjectId) {
                    const projectTodos = this.todoManager.getAllTodos()
                        .filter(todo => todo.projectId === this.activeProjectId);
                    todos = projectTodos;
                } else {
                    todos = this.todoManager.getActiveTodos();
                }
        }
    
        if (this.activeProjectId) {
            tasksContainer.innerHTML = this.renderTodoList(todos);
            return;
        }
    
        const todosByProject = new Map();
        
        todos.forEach(todo => {
            const projectId = todo.projectId;
            if (!this.projectManager.getProject(projectId)) return;
            
            if (!todosByProject.has(projectId)) {
                todosByProject.set(projectId, []);
            }
            todosByProject.get(projectId).push(todo);
        });
    
        const html = Array.from(todosByProject.entries()).map(([projectId, projectTodos]) => {
            const project = this.projectManager.getProject(projectId);
            if (!project) return '';
            return `
                <div class="project-section">
                    <h3 class="project-header">${project.name}</h3>
                    ${this.renderTodoList(projectTodos)}
                </div>
            `;
        }).join('');
    
        tasksContainer.innerHTML = html || '<p>No tasks yet</p>';
    }

    renderTodoList(todos) {
        if (!todos.length) return '';
        
        return todos.map(todo => `
            <div class="todo-item ${todo.completed ? 'completed' : ''}" 
                 data-id="${todo.id}" 
                 data-project-id="${todo.projectId || this.activeProjectId}">
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <div class="todo-content">
                    <div class="todo-title">${todo.title}</div>
                    ${todo.description ? `<div class="todo-description">${todo.description}</div>` : ''}
                    <div class="todo-metadata">
                        ${todo.dueDate ? `<span>Due: ${todo.dueDate}</span>` : ''}
                        <span>Priority: ${todo.priority}</span>
                    </div>
                </div>
                <div class="todo-actions">
                    <button class="edit-todo">
                        <svg class="feather feather-edit" fill="none" height="16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateMainHeader(title) {
        const contentHeader = document.querySelector('.content-header h2');
        contentHeader.textContent = title;
    }

    init() {
        const appContainer = document.createElement('div');
        appContainer.className = 'app-container';

        appContainer.appendChild(this.createHeader());
        appContainer.appendChild(this.createSidebar());
        appContainer.appendChild(this.createMain());

        const root = document.getElementById('app');
        root.innerHTML = '';
        root.appendChild(appContainer);

        this.setupEventListeners();
        this.setupProjectEvents();
        this.setupTodoEvents();
        this.renderTodos('all');
    }

    setupEventListeners() {
        const menuToggle = document.querySelector('.menu-toggle');
        const sidebar = document.querySelector('.app-sidebar');
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        const userProfile = document.querySelector('.user-profile');
        const userDropdown = document.querySelector('.user-dropdown');

        userProfile.addEventListener('click', () => {
            userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
        });

        document.addEventListener('click', (e) => {
            if (!userProfile.contains(e.target)) {
                userDropdown.style.display = 'none';
            }
        });

        const signOutBtn = document.querySelector('.sign-out');
        signOutBtn.addEventListener('click', () => {
            this.showSignOutConfirmation();
        });

        const aboutBtn = document.querySelector('.about');
        aboutBtn.addEventListener('click', () => {
            this.showAboutModal();
        });

        const viewLinks = document.querySelectorAll('.sidebar-nav a[data-view]');
        viewLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                document.querySelectorAll('.sidebar-nav a, .project-item').forEach(el => {
                    el.classList.remove('active');
                });

                link.classList.add('active');

                this.activeProjectId = null;

                const view = link.dataset.view;
                this.updateMainHeader(link.textContent);
                this.renderTodos(view);
            });
        });
    }

    setupProjectEvents() {
        const projectsList = document.querySelector('.projects-list');
        const addProjectBtn = document.getElementById('add-project-btn');
        const addProjectForm = document.querySelector('.add-project-form');
        const projectInput = document.querySelector('.add-project-input');
        const saveProjectBtn = document.getElementById('save-project-btn');
    
        this.renderProjects(this.projectManager.getAllProjects());
    
        addProjectBtn.addEventListener('click', () => {
            addProjectBtn.style.display = 'none';
            addProjectForm.style.display = 'block';
            projectInput.focus();
        });
    
        document.addEventListener('click', (e) => {
            if (!addProjectForm.contains(e.target) && e.target !== addProjectBtn) {
                addProjectBtn.style.display = 'block';
                addProjectForm.style.display = 'none';
                projectInput.value = '';
            }
        });
    
        saveProjectBtn.addEventListener('click', () => {
            const projectName = projectInput.value.trim();
            if (projectName) {
                const newProject = this.projectManager.createProject(projectName);
                this.renderProjects(this.projectManager.getAllProjects());
                addProjectBtn.style.display = 'block';
                addProjectForm.style.display = 'none';
                projectInput.value = '';
            }
        });
    
        projectsList.addEventListener('click', (e) => {
            const projectItem = e.target.closest('.project-item');
            
            if (e.target.classList.contains('delete-project')) {
                const projectId = e.target.closest('.project-item').dataset.id;
                this.projectManager.deleteProject(projectId);
                
                if (this.activeProjectId === projectId) {
                    this.activeProjectId = null;
                    const allTasksLink = document.querySelector('.sidebar-nav a[data-view="all"]');
                    if (allTasksLink) {
                        allTasksLink.click();
                    } else {
                        this.updateMainHeader('All Tasks');
                        this.renderTodos('all');
                    }
                }
                
                this.renderProjects(this.projectManager.getAllProjects());
                return;
            }
    
            if (projectItem) {
                const projectId = projectItem.dataset.id;
                const project = this.projectManager.getProject(projectId);
                
                this.activeProjectId = projectId;
                this.renderProjects(this.projectManager.getAllProjects());
                this.updateMainHeader(project.name);
                this.renderTodos();
    
                document.querySelectorAll('.sidebar-nav a').forEach(link => {
                    link.classList.remove('active');
                });
            }
        });
    }

    setupTodoEvents() {
        const addTaskBtn = document.querySelector('.add-task-btn');
        const tasksContainer = document.querySelector('.tasks-container');
    
        addTaskBtn.addEventListener('click', () => {
            this.showTodoModal();
        });
    
        tasksContainer.addEventListener('click', (e) => {
            const todoItem = e.target.closest('.todo-item');
            if (!todoItem) return;
            
            const todoId = todoItem.dataset.id;
            const projectId = todoItem.dataset.projectId || this.activeProjectId;
    
            if (e.target.classList.contains('todo-checkbox')) {
                this.todoManager.toggleTodoComplete(projectId, todoId);
                this.renderCurrentView();
            }
    
            if (e.target.closest('.edit-todo')) {
                const todo = this.todoManager.getTodo(projectId, todoId);
                if (todo) {
                    this.showTodoModal(todo, projectId);
                }
            }
        });
    }

    renderCurrentView() {
        const activeLink = document.querySelector('.sidebar-nav a.active');
        const currentView = activeLink ? activeLink.dataset.view : 'all';
        this.renderTodos(currentView);
    }

    renderProjects(projects) {
        const projectsList = document.querySelector('.projects-list');
        const addTaskBtn = document.querySelector('.add-task-btn');
        
        if (projects.length === 0) {
            addTaskBtn.disabled = true;
            addTaskBtn.classList.add('disabled');
        } else {
            addTaskBtn.disabled = false;
            addTaskBtn.classList.remove('disabled');
        }
    
        projectsList.innerHTML = projects.map(project => `
            <li class="project-item ${project.id === this.activeProjectId ? 'active' : ''}" data-id="${project.id}">
                <span class="project-name">${project.name}</span>
                <button class="delete-project" aria-label="Delete project">×</button>
            </li>
        `).join('');
    }
}