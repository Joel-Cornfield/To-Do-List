import TodoManager, { Todo } from './todos';

export class Project {
    constructor(name) {
        this.id = Date.now().toString();
        this.name = name;
        this.todos = [];
    }
}

export default class ProjectManager {
    constructor(todoManager) {
        this.projects = [];
        this.todoManager = todoManager;
        this.defaultProjects = [
            {
                name: "Default Project",
                task: {
                    title: "Sample Task Title",
                    description: "Sample task description.",
                    priority: "medium",
                    dueDate: () => new Date(Date.now() + 86400000).toISOString().split('T')[0] // 1 day from now
                }
            }
        ];
        this.loadProjects();
    }

    loadProjects() {
        const savedProjects = localStorage.getItem('ToDoListProjects');
        if (savedProjects) {
            this.projects = JSON.parse(savedProjects);
        } else {
            const defaultProject = this.createDefaultProject();
            this.projects = [defaultProject];
            this.saveProjects();
        }
    }

    saveProjects() {
        localStorage.setItem('ToDoListProjects', JSON.stringify(this.projects));
    }

    createDefaultProject() {
        const defaultProject = this.defaultProjects[0]; // Only one default project now
        const project = this.createProject(defaultProject.name);
        
        const todo = new Todo(
            defaultProject.task.title,
            defaultProject.task.description,
            defaultProject.task.dueDate(),
            defaultProject.task.priority
        );
        this.todoManager.addTodo(project.id, todo);
        
        return project;
    }

    createProject(name) {
        const project = new Project(name);
        this.projects.push(project);
        this.saveProjects();
        return project;
    }

    deleteProject(projectId) {
        this.projects = this.projects.filter(project => project.id !== projectId);
        this.saveProjects();
    
        this.todoManager.removeProjectTasks(projectId);
    }

    getProject(projectId) {
        return this.projects.find(project => project.id === projectId);
    }

    getAllProjects() {
        return this.projects;
    }
}
