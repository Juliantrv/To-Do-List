import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonItemSliding, IonItem, IonCheckbox, IonLabel, IonChip, IonIcon, IonItemOptions, IonList, IonItemOption, AlertController } from "@ionic/angular/standalone";

// Models
import { Task } from '@models/task.model';
import { Category } from '@models/category.model';
// Services
import { TaskService } from '@services/task.service';
import { ToastService } from '@services/toast.service';

/**
 * Component for displaying and managing a grid of tasks.
 * 
 * This component renders a list of tasks with interactive features including
 * task completion toggling, deletion with confirmation, and category display.
 * It uses Ionic sliding items for swipe-to-delete functionality and integrates
 * with task and toast services for data management and user feedback.
 */
@Component({
  selector: 'app-tasks-grid',
  templateUrl: './tasks-grid.component.html',
  styleUrls: ['./tasks-grid.component.scss'],
  imports: [IonItemOption, IonItemSliding, IonItem, IonCheckbox, IonLabel, IonChip, IonIcon, IonItemOptions, IonList, FormsModule, CommonModule]
})
export class TasksGridComponent {
  /**
   * Input signal containing the array of tasks to display.
   * @type {InputSignal<Task[] | undefined>}
   */
  tasks = input<Task[]>();
  
  /**
   * Input signal containing the array of available categories.
   * @type {InputSignal<Category[] | undefined>}
   */
  categories = input<Category[]>();
  
  /**
   * Input signal for the feature flag controlling categories display.
   * @type {InputSignal<boolean | undefined>}
   */
  enableCategories = input<boolean>();
  
  /**
   * Output event emitter to notify parent component to reload tasks.
   * @type {OutputEmitterRef<void>}
   */
  loadTasks = output();

  /**
   * Task service for managing task operations.
   * @private
   */
  private taskService = inject(TaskService);
  
  /**
   * Alert controller for displaying confirmation dialogs.
   * @private
   */
  private alertController = inject(AlertController);
  
  /**
   * Toast service for displaying notification messages.
   * @private
   */
  private toastService = inject(ToastService);

  /**
   * Retrieves the color associated with a specific category.
   * 
   * @param {string} categoryId - ID of the category.
   * @returns {string} Hexadecimal color code or default blue color.
   */
  getCategoryColor(categoryId: string): string {
    const category = this.categories()?.find(c => c.id === categoryId);
    return category?.color || '#3880ff';
  }

  /**
   * Toggles the completion status of a task.
   * 
   * Updates the task's completion state in the service and displays
   * a toast notification indicating the new status.
   * 
   * @param {Task} task - The task object to toggle.
   * @returns {Promise<void>} Promise that resolves when toggle is complete.
   */
  async toggleTask(task: Task): Promise<void> {
    
    this.taskService.updateTask(task);
    
    // Mostrar mensaje según el nuevo estado
    const message = task.completed 
      ? '✓ Tarea completada' 
      : 'Tarea marcada como pendiente';
    
    await this.toastService.showToast(message, task.completed ? 'success' : 'primary');
  }

  /**
   * Retrieves the icon name associated with a specific category.
   * 
   * @param {string} categoryId - ID of the category.
   * @returns {string} Icon name or default 'pricetag' icon.
   */
  getCategoryIcon(categoryId: string): string {
    const category = this.categories()?.find(c => c.id === categoryId);
    return category?.icon || 'pricetag';
  }

  /**
   * Retrieves the name of a specific category.
   * 
   * @param {string} categoryId - ID of the category.
   * @returns {string} Category name or 'Sin categoría' if not found.
   */
  getCategoryName(categoryId: string): string {
    const category = this.categories()?.find(c => c.id === categoryId);
    return category?.name || 'Sin categoría';
  }

  /**
   * Displays a confirmation dialog before deleting a task.
   * 
   * Shows an Ionic alert with options to cancel or confirm the deletion.
   * If confirmed, proceeds to delete the task.
   * 
   * @param {string} taskId - ID of the task to delete.
   * @returns {Promise<void>} Promise that resolves when alert is presented.
   */
  async deleteTask(taskId: string): Promise<void> {
    const task = this.tasks()?.find(t => t.id === taskId);
    if (!task) return;

    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de eliminar la tarea "${task.name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.performDelete(taskId);
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Executes the task deletion operation.
   * 
   * Removes the task from the service, emits an event to reload the task list,
   * and displays a success toast notification.
   * 
   * @private
   * @param {string} taskId - ID of the task to delete.
   * @returns {Promise<void>} Promise that resolves when deletion is complete.
   */
  private async performDelete(taskId: string): Promise<void> {
    this.taskService.deleteTask(taskId);
    this.loadTasks.emit();
    
    await this.toastService.showToast('✓ Tarea eliminada', 'danger');
  }
}
