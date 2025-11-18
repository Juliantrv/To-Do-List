import { Component, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonCardContent, IonItem, IonLabel, IonCard, IonSelect, IonSelectOption } from "@ionic/angular/standalone";

// Models
import { Category } from '@models/category.model';
import { Task } from '@models/task.model';

/**
 * Component for filtering tasks by category.
 * 
 * This component provides a dropdown selector that allows users to filter
 * the task list by category. It supports filtering by specific categories,
 * tasks without a category, or showing all tasks. The component uses Angular
 * signals for reactive state management of the selected filter.
 */
@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  imports: [IonCard, IonLabel, IonItem, IonCardContent, IonSelect, IonSelectOption, FormsModule]
})
export class FiltersComponent {
  /**
   * Input signal containing the array of available categories.
   * @type {InputSignal<Category[] | undefined>}
   */
  categories = input<Category[]>();
  
  /**
   * Input signal containing the array of all tasks.
   * @type {InputSignal<Task[] | undefined>}
   */
  tasks = input<Task[]>();

  /**
   * Signal holding the currently selected filter category ID.
   * 
   * Can be a category ID, 'no-category' for tasks without category,
   * or null for showing all tasks.
   * 
   * @type {WritableSignal<string | 'no-category' | null>}
   */
  selectedFilterCategoryId = signal<Category['id'] | 'no-category' | null>(null);

  /**
   * Retrieves the filtered list of tasks based on the selected filter.
   * 
   * Filters the tasks array according to the current filter selection:
   * - If no filter is selected (null), returns all tasks
   * - If 'no-category' is selected, returns tasks without a category
   * - Otherwise, returns tasks matching the selected category ID
   * 
   * @returns {Task[]} Array of filtered tasks, or empty array if no tasks exist.
   */
  getFilteredTasks(): Task[] {
    const tasks = this.tasks();
    if (tasks === undefined || tasks.length === 0) {
      return [];
    }

    if (!this.selectedFilterCategoryId()) {
      return tasks;
    }
    
    if (this.selectedFilterCategoryId() === 'no-category') {
      return tasks.filter(task => !task.categoryId);
    }
    
    return tasks.filter(task => task.categoryId === this.selectedFilterCategoryId());
  }
}
