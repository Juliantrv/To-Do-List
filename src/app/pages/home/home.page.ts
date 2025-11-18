import { Component, OnInit, viewChild, signal, inject, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash, pricetags, settings } from 'ionicons/icons';

// Models
import { Task } from '@models/task.model';
import { Category } from '@models/category.model';

// RxJS
import { Subscription } from 'rxjs';

// Services
import { TaskService } from '@services/task.service';
import { CategoryService } from '@services/category.service';
import { RemoteConfigService } from '@services/remote-config.service';

// components
import { AddTaskComponent } from './components/add-task/add-task.component';
import { FiltersComponent } from './components/filters/filters.component';
import { TasksGridComponent } from './components/tasks-grid/tasks-grid.component';

/**
 * Home page component - main view for managing tasks.
 * 
 * This is the primary page of the To-Do List application where users can view,
 * add, filter, and manage their tasks. It integrates with multiple services to
 * handle task management, categories, and feature flags. The component uses
 * Angular signals for reactive state management and subscribes to remote
 * configuration changes to dynamically enable/disable features.
 * 
 * @implements {OnInit}
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    AddTaskComponent, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    FiltersComponent,
    TasksGridComponent
  ]
})
export class HomePage implements OnInit {
  /**
   * ViewChild reference to the filters component.
   * @type {Signal<FiltersComponent | undefined>}
   */
  filtersComponent = viewChild<FiltersComponent>('filters');
  
  /**
   * Destroy reference for cleanup operations.
   * @private
   */
  private destroyRef = inject(DestroyRef);
  
  /**
   * Task service for managing task operations.
   * @private
   */
  private taskService = inject(TaskService);
  
  /**
   * Category service for managing category operations.
   * @private
   */
  private categoryService= inject(CategoryService);
  
  /**
   * Router for navigation between pages.
   * @private
   */
  private router = inject(Router);
  
  /**
   * Remote config service for managing feature flags.
   * @private
   */
  private remoteConfigService = inject(RemoteConfigService);
  
  /**
   * Subscription to remote configuration changes.
   * @private
   */
  private configSubscription?: Subscription;
  
  /**
   * Signal containing all tasks.
   * @type {WritableSignal<Task[]>}
   */
  tasks = signal<Task[]>([]);
  
  /**
   * Signal containing all categories.
   * @type {WritableSignal<Category[]>}
   */
  categories = signal<Category[]>([]);
  
  /**
   * Feature flag signal for enabling/disabling categories feature.
   * @type {WritableSignal<boolean>}
   */
  enableCategories = signal(true);
  
  /**
   * Feature flag signal for enabling/disabling filters feature.
   * @type {WritableSignal<boolean>}
   */
  enableFilters = signal(true);
  
  /**
   * Lifecycle hook called on component initialization.
   * 
   * Registers Ionic icons, loads initial data (tasks and categories),
   * subscribes to remote configuration changes, and sets up cleanup on destroy.
   * 
   * @returns {void}
   */
  ngOnInit() {
    addIcons({ add, trash, pricetags, settings });
    this.loadTasks();
    this.loadCategories();
    this.configSubscription = this.remoteConfigService.config$.subscribe(config => {
      this.enableCategories.set(config.enableCategories);
      this.enableFilters.set(config.enableFilters);
    });
    this.destroyRef.onDestroy(() => this.configSubscription?.unsubscribe());
  }

  /**
   * Ionic lifecycle hook called when the page is about to enter.
   * 
   * Reloads categories to ensure the list is up-to-date when navigating
   * back from the categories page.
   * 
   * @returns {void}
   */
  ionViewWillEnter() {
    this.loadCategories();
  }

  /**
   * Loads all tasks from the task service.
   * 
   * Retrieves tasks from localStorage and updates the tasks signal.
   * 
   * @returns {void}
   */
  loadTasks(): void {
    this.tasks.set(this.taskService.getTasks());
  }

  /**
   * Loads all categories from the category service.
   * 
   * Retrieves categories from localStorage and updates the categories signal.
   * 
   * @returns {void}
   */
  loadCategories(): void {
    this.categories.set(this.categoryService.getCategories());
  }

  /**
   * Navigates to the categories management page.
   * 
   * @returns {void}
   */
  goToCategories(): void {
    this.router.navigate(['/categories']);
  }

  /**
   * Navigates to the settings page.
   * 
   * @returns {void}
   */
  goToSettings(): void {
    this.router.navigate(['/settings']);
  }

  /**
   * Retrieves the filtered tasks from the filters component.
   * 
   * Gets the current filtered task list based on active filters.
   * Falls back to all tasks if filters component is not available.
   * 
   * @returns {Task[]} Array of filtered tasks or all tasks if no filters applied.
   */
  getFilteredTasks(): Task[] {
    return this.filtersComponent()?.getFilteredTasks() ?? this.tasks();;
  }

}
