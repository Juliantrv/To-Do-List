import { Component, inject, input, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonCardContent, IonCard, IonItem, IonInput, IonButton, IonIcon, IonSelect, IonSelectOption, IonModal, IonFabButton, IonFab } from "@ionic/angular/standalone";

// Models
import { Category } from '@models/category.model';

// Services
import { TaskService } from '@services/task.service';
import { ToastService } from '@services/toast.service';

/**
 * Component for adding new tasks to the application.
 * 
 * This component provides a modal interface with a floating action button (FAB)
 * that allows users to create new tasks. Users can enter a task name and optionally
 * assign it to a category. The component validates input, creates the task through
 * the task service, and provides feedback via toast notifications.
 */
@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
  imports: [IonFab, IonFabButton, 
    IonModal, 
    IonIcon,
    IonButton,
    IonInput,
    IonItem,
    IonCard,
    IonCardContent,
    FormsModule,
    IonSelect,
    IonSelectOption
  ]
})
export class AddTaskComponent {
  /**
   * Input signal containing the array of available categories for task assignment.
   * @type {InputSignal<Category[]>}
   */
  categories = input<Category[]>([]);
  
  /**
   * Input signal for the feature flag controlling categories functionality.
   * @type {InputSignal<boolean | undefined>}
   */
  enableCategories = input<boolean>();
  
  /**
   * Output event emitter to notify parent component to reload tasks.
   * @type {OutputEmitterRef<void>}
   */
  loadTasks = output();

  /**
   * ViewChild reference to the modal component.
   * @type {Signal<IonModal>}
   */
  modal = viewChild.required<IonModal>('modal');

  /**
   * Task service for managing task operations.
   * @private
   */
  private taskService = inject(TaskService);
  
  /**
   * Toast service for displaying notification messages.
   * @private
   */
  private toastService = inject(ToastService);

  /**
   * Signal holding the name of the new task being created.
   * @type {WritableSignal<string>}
   */
  newTaskName = signal('');
  
  /**
   * Signal holding the ID of the selected category for the new task.
   * @type {WritableSignal<string | null>}
   */
  selectedCategoryId = signal<Category['id'] | null>(null);

  /**
   * Creates and adds a new task.
   * 
   * Validates that the task name is not empty, creates the task with the
   * selected category (if any), clears the form, dismisses the modal,
   * emits an event to reload tasks, and displays a success toast notification.
   * 
   * @returns {Promise<void>} Promise that resolves when the task is added.
   */
  async addTask(): Promise<void> {
    const taskName = this.newTaskName().trim();
    
    if (taskName) {
      // Agregar tarea con categoría seleccionada
      this.taskService.addTask(taskName, this.selectedCategoryId() || undefined);
      this.newTaskName.set('');
      this.modal().dismiss();
      this.selectedCategoryId.set(null);
      this.loadTasks.emit();
      
      await this.toastService.showToast('Tarea agregada correctamente', 'success');
    }
  }

}
