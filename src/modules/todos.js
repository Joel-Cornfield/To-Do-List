import { isToday, isFuture, parseISO } from 'date-fns';

export class Todo {
    constructor(title, description = '', dueDate = null, priority = 'medium') {
        this.id = Date.now().toString();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
        this.createdAt = new Date();
    }
}

export default class TodoManager {
    constructor() {
        this.todos = new Map();
        this.loadTodos();
    }

    loadTodos() {
        const savedTodos = localStorage.getItem('ToDoListTodos');
        if (savedTodos) {
            const todoData = JSON.parse(savedTodos);
            this.todos = new Map(todoData);
        }
    }

    saveTodos() {
        localStorage.setItem('ToDoListTodos', JSON.stringify([...this.todos]));
    }

    addTodo(projectId, todo) {
        if (!this.todos.has(projectId)) {
            this.todos.set(projectId, []);
        }
        this.todos.get(projectId).push(todo);
        this.saveTodos();
    }

    getTodo(projectId, todoId) {
        const projectTodos = this.todos.get(projectId);
        if (projectTodos) {
            return projectTodos.find(todo => todo.id === todoId);
        }
        return null;
    }
    
    updateTodo(projectId, todoId, updatedTodo) {
        const projectTodos = this.todos.get(projectId);
        if (projectTodos) {
            const index = projectTodos.findIndex(todo => todo.id === todoId);
            if (index !== -1) {
                projectTodos[index] = updatedTodo;
                this.saveTodos();
            }
        }
    }

    getAllTodos() {
        const allTodos = [];
        this.todos.forEach((todos, projectId) => {
            todos.forEach(todo => {
                allTodos.push({
                    ...todo,
                    projectId
                });
            });
        });
        return allTodos;
    }

    getTodayTodos() {
        const allTodos = this.getAllTodos();
        return allTodos.filter(todo => {
            if (!todo.dueDate || todo.completed) return false;
            return isToday(parseISO(todo.dueDate));
        });
    }

    getUpcomingTodos() {
        const allTodos = this.getAllTodos();
        return allTodos.filter(todo => {
            if (!todo.dueDate || todo.completed) return false;
            return isFuture(parseISO(todo.dueDate));
        }).sort((a, b) => {
            return parseISO(a.dueDate) - parseISO(b.dueDate);
        });
    }

    deleteTodo(projectId, todoId) {
        const projectTodos = this.todos.get(projectId);
        if (projectTodos) {
            const index = projectTodos.findIndex(todo => todo.id === todoId);
            if (index !== -1) {
                projectTodos.splice(index, 1);
                this.saveTodos();
            }
        }
    }

    toggleTodoComplete(projectId, todoId) {
        const projectTodos = this.todos.get(projectId);
        if (projectTodos) {
            const todo = projectTodos.find(todo => todo.id === todoId);
            if (todo) {
                todo.completed = !todo.completed;
                this.saveTodos();
            }
        }
    }

    getCompletedTodos() {
        const allTodos = this.getAllTodos();
        return allTodos.filter(todo => todo.completed);
    }

    getActiveTodos() {
        const allTodos = this.getAllTodos();
        return allTodos.filter(todo => !todo.completed);
    }

    removeProjectTasks(projectId) {
        this.todos.delete(projectId);
        this.saveTodos();
    }
}