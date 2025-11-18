import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

/**
 * Service for managing tasks in the To-Do List application.
 * 
 * This service handles all CRUD operations for tasks, storing them in localStorage.
 * It provides methods to create, read, update, and delete tasks, as well as toggle
 * their completion status.
 * 
 * @Injectable
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  /**
   * Storage key used to persist tasks in localStorage.
   * @private
   * @readonly
   */
  private readonly STORAGE_KEY = 'tasks';

  constructor() { }

  /**
   * Retrieves all tasks from local storage.
   * 
   * @returns {Task[]} Array of tasks with dates properly parsed.
   */
  getTasks(): Task[] {
    try {
      const tasksJson = localStorage.getItem(this.STORAGE_KEY);
      if (tasksJson) {
        const tasks = JSON.parse(tasksJson);
        // Convertir las fechas de string a Date
        return tasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      return [];
    }
  }

  /**
   * Adds a new task to local storage.
   * 
   * @param {string} taskName - Name of the task to create.
   * @param {string} [categoryId] - Optional ID of the category to assign the task to.
   * @returns {Task} The newly created task.
   */
  addTask(taskName: string, categoryId?: string): Task {
    const tasks = this.getTasks();
    
    const newTask: Task = {
      id: this.generateId(),
      name: taskName,
      completed: false,
      categoryId: categoryId,
      createdAt: new Date()
    };

    tasks.push(newTask);
    this.saveTasks(tasks);
    
    return newTask;
  }

  /**
   * Updates an existing task in local storage.
   * 
   * @param {Task} task - The task object with updated properties.
   * @returns {void}
   */
  updateTask(task: Task): void {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    
    if (index !== -1) {
      tasks[index] = task;
      this.saveTasks(tasks);
    }
  }

  /**
   * Toggles the completion status of a task.
   * 
   * @param {string} taskId - ID of the task to toggle.
   * @returns {Task | null} The updated task or null if not found.
   */
  toggleTaskCompletion(taskId: string): Task | null {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
      task.completed = !task.completed;
      this.updateTask(task);
      return task;
    }
    
    return null;
  }

  /**
   * Deletes a task from local storage.
   * 
   * @param {string} taskId - ID of the task to delete.
   * @returns {boolean} True if the task was deleted, false if not found.
   */
  deleteTask(taskId: string): boolean {
    const tasks = this.getTasks();
    const initialLength = tasks.length;
    const filteredTasks = tasks.filter(t => t.id !== taskId);
    
    if (filteredTasks.length < initialLength) {
      this.saveTasks(filteredTasks);
      return true;
    }
    
    return false;
  }

  /**
   * Saves the tasks array to local storage.
   * 
   * @private
   * @param {Task[]} tasks - Array of tasks to persist.
   * @returns {void}
   */
  private saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error al guardar tareas:', error);
    }
  }

  /**
   * Generates a unique ID for tasks.
   * 
   * Combines current timestamp with a random string to ensure uniqueness.
   * 
   * @private
   * @returns {string} Unique identifier string.
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
