import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { Task } from '../models/task.model';

describe('TaskService - Marcar tarea como completada', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('DADO que existe una tarea en la lista CUANDO el usuario la marca como completada ENTONCES la tarea cambia su estado a completada', () => {
    // DADO: Crear una tarea
    const task = service.addTask('Tarea de prueba');
    expect(task.completed).toBe(false);

    // CUANDO: Marcar como completada
    task.completed = true;
    service.updateTask(task);

    // ENTONCES: Verificar que está completada
    const tasks = service.getTasks();
    const updatedTask = tasks.find(t => t.id === task.id);
    expect(updatedTask?.completed).toBe(true);
  });

  it('Y el cambio se guarda en el almacenamiento local', () => {
    // DADO: Crear una tarea
    const task = service.addTask('Tarea persistente');
    
    // CUANDO: Marcar como completada
    task.completed = true;
    service.updateTask(task);

    // ENTONCES: Verificar que se guardó en localStorage
    const storedTasks = localStorage.getItem('tasks');
    expect(storedTasks).toBeTruthy();
    
    const parsedTasks = JSON.parse(storedTasks!);
    const storedTask = parsedTasks.find((t: Task) => t.id === task.id);
    expect(storedTask.completed).toBe(true);
  });

  it('debe poder desmarcar una tarea completada', () => {
    // DADO: Crear y completar una tarea
    const task = service.addTask('Tarea a desmarcar');
    task.completed = true;
    service.updateTask(task);

    // CUANDO: Desmarcar
    task.completed = false;
    service.updateTask(task);

    // ENTONCES: Verificar que está desmarcada
    const tasks = service.getTasks();
    const updatedTask = tasks.find(t => t.id === task.id);
    expect(updatedTask?.completed).toBe(false);
  });

  it('debe usar el método toggleTaskCompletion correctamente', () => {
    // DADO: Crear una tarea
    const task = service.addTask('Tarea para toggle');
    const taskId = task.id;

    // CUANDO: Hacer toggle
    const toggledTask = service.toggleTaskCompletion(taskId);

    // ENTONCES: Verificar cambio de estado
    expect(toggledTask?.completed).toBe(true);

    // CUANDO: Hacer toggle nuevamente
    const toggledAgain = service.toggleTaskCompletion(taskId);

    // ENTONCES: Verificar que volvió al estado anterior
    expect(toggledAgain?.completed).toBe(false);
  });

  // ========== ELIMINAR TAREA ==========

  it('DADO que existe una tarea en la lista CUANDO el usuario elige eliminarla ENTONCES la tarea desaparece de la lista', () => {
    // DADO: Crear tareas
    const task1 = service.addTask('Tarea 1');
    const task2 = service.addTask('Tarea 2');
    const task3 = service.addTask('Tarea 3');
    
    let tasks = service.getTasks();
    expect(tasks.length).toBe(3);

    // CUANDO: Eliminar tarea 2
    service.deleteTask(task2.id);

    // ENTONCES: Verificar que desapareció
    tasks = service.getTasks();
    expect(tasks.length).toBe(2);
    expect(tasks.find(t => t.id === task2.id)).toBeUndefined();
    expect(tasks.find(t => t.id === task1.id)).toBeTruthy();
    expect(tasks.find(t => t.id === task3.id)).toBeTruthy();
  });

  it('Y se actualiza el almacenamiento local después de eliminar', () => {
    // DADO: Crear tareas
    const task1 = service.addTask('Tarea persistente 1');
    const task2 = service.addTask('Tarea a eliminar');
    const task3 = service.addTask('Tarea persistente 2');

    // CUANDO: Eliminar tarea
    service.deleteTask(task2.id);

    // ENTONCES: Verificar que se actualizó localStorage
    const storedTasks = localStorage.getItem('tasks');
    expect(storedTasks).toBeTruthy();
    
    const parsedTasks = JSON.parse(storedTasks!);
    expect(parsedTasks.length).toBe(2);
    expect(parsedTasks.find((t: Task) => t.id === task2.id)).toBeUndefined();
    expect(parsedTasks.find((t: Task) => t.id === task1.id)).toBeTruthy();
    expect(parsedTasks.find((t: Task) => t.id === task3.id)).toBeTruthy();
  });

  it('debe manejar la eliminación de una tarea inexistente sin errores', () => {
    // DADO: Crear una tarea
    service.addTask('Tarea existente');
    
    // CUANDO: Intentar eliminar una tarea que no existe
    expect(() => service.deleteTask('id-inexistente')).not.toThrow();
    
    // ENTONCES: La tarea existente debe seguir ahí
    const tasks = service.getTasks();
    expect(tasks.length).toBe(1);
  });

  it('debe eliminar todas las tareas cuando se eliminan una por una', () => {
    // DADO: Crear múltiples tareas
    const task1 = service.addTask('Tarea 1');
    const task2 = service.addTask('Tarea 2');
    const task3 = service.addTask('Tarea 3');

    // CUANDO: Eliminar todas
    service.deleteTask(task1.id);
    service.deleteTask(task2.id);
    service.deleteTask(task3.id);

    // ENTONCES: La lista debe estar vacía
    const tasks = service.getTasks();
    expect(tasks.length).toBe(0);
    
    const storedTasks = localStorage.getItem('tasks');
    expect(JSON.parse(storedTasks!)).toEqual([]);
  });

  // ========== ASOCIAR TAREA CON CATEGORÍA ==========

  it('debe crear una tarea sin categoría cuando no se proporciona categoryId', () => {
    // DADO/CUANDO: Crear tarea sin categoryId
    const task = service.addTask('Tarea sin categoría');

    // ENTONCES: La tarea no debe tener categoryId
    expect(task.categoryId).toBeUndefined();
    
    const tasks = service.getTasks();
    const retrievedTask = tasks.find(t => t.id === task.id);
    expect(retrievedTask?.categoryId).toBeUndefined();
  });

  it('DADO que existe una tarea y categorías disponibles CUANDO el usuario selecciona una categoría para la tarea ENTONCES la tarea queda asociada a esa categoría', () => {
    // DADO: Una categoría disponible
    const categoryId = 'cat-123';

    // CUANDO: Crear tarea con categoría
    const task = service.addTask('Tarea con categoría', categoryId);

    // ENTONCES: La tarea debe tener la categoría asociada
    expect(task.categoryId).toBe(categoryId);
    
    const tasks = service.getTasks();
    const retrievedTask = tasks.find(t => t.id === task.id);
    expect(retrievedTask?.categoryId).toBe(categoryId);
  });

  it('Y la asociación se guarda en el almacenamiento local', () => {
    // DADO: Una categoría
    const categoryId = 'cat-456';

    // CUANDO: Crear tarea con categoría
    const task = service.addTask('Tarea persistente con categoría', categoryId);

    // ENTONCES: Verificar que se guardó en localStorage
    const storedTasks = localStorage.getItem('tasks');
    expect(storedTasks).toBeTruthy();
    
    const parsedTasks = JSON.parse(storedTasks!);
    const storedTask = parsedTasks.find((t: Task) => t.id === task.id);
    expect(storedTask.categoryId).toBe(categoryId);
  });

  it('debe poder cambiar la categoría de una tarea existente', () => {
    // DADO: Crear tarea con categoría inicial
    const task = service.addTask('Tarea a cambiar', 'cat-1');
    expect(task.categoryId).toBe('cat-1');

    // CUANDO: Cambiar a nueva categoría
    task.categoryId = 'cat-2';
    service.updateTask(task);

    // ENTONCES: Verificar que se actualizó
    const tasks = service.getTasks();
    const updatedTask = tasks.find(t => t.id === task.id);
    expect(updatedTask?.categoryId).toBe('cat-2');
  });

  it('debe poder remover la categoría de una tarea', () => {
    // DADO: Crear tarea con categoría
    const task = service.addTask('Tarea con categoría removible', 'cat-123');
    expect(task.categoryId).toBe('cat-123');

    // CUANDO: Remover categoría
    task.categoryId = undefined;
    service.updateTask(task);

    // ENTONCES: Verificar que no tiene categoría
    const tasks = service.getTasks();
    const updatedTask = tasks.find(t => t.id === task.id);
    expect(updatedTask?.categoryId).toBeUndefined();
  });

  it('debe crear múltiples tareas con diferentes categorías', () => {
    // DADO/CUANDO: Crear tareas con diferentes categorías
    const task1 = service.addTask('Tarea trabajo', 'cat-trabajo');
    const task2 = service.addTask('Tarea personal', 'cat-personal');
    const task3 = service.addTask('Tarea sin categoría');

    // ENTONCES: Verificar asociaciones
    const tasks = service.getTasks();
    expect(tasks.length).toBe(3);
    expect(tasks.find(t => t.id === task1.id)?.categoryId).toBe('cat-trabajo');
    expect(tasks.find(t => t.id === task2.id)?.categoryId).toBe('cat-personal');
    expect(tasks.find(t => t.id === task3.id)?.categoryId).toBeUndefined();
  });
});
