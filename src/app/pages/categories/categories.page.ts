import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton
 } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash, create, arrowBack } from 'ionicons/icons';

// Components
import { AddCategoryComponent } from './components/add-category/add-category.component';
import { CategoryGridComponent } from './components/category-grid/category-grid.component';

// Models
import { Category } from '@models/category.model';

// Services
import { CategoryService } from '@services/category.service';

/**
 * Categories page component for managing task categories.
 * 
 * This page allows users to view, add, edit, and delete task categories.
 * It provides a comprehensive interface for category management, displaying
 * all categories in a grid layout and integrating with the category service
 * for CRUD operations. The page automatically refreshes the category list
 * when entering the view.
 * 
 * @implements {OnInit}
 */
@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    AddCategoryComponent,
    CategoryGridComponent
  ]
})
export class CategoriesPage implements OnInit {
  /**
   * Signal containing all categories.
   * @type {WritableSignal<Category[]>}
   */
  categories = signal<Category[]>([]);

  /**
   * Category service for managing category operations.
   * @private
   */
  private categoryService = inject(CategoryService);
  
  /**
   * Router for navigation between pages.
   * @private
   */
  private router = inject(Router);
  
  /**
   * Lifecycle hook called on component initialization.
   * 
   * Registers Ionic icons for the page and loads the initial list of categories.
   * 
   * @returns {void}
   */
  ngOnInit() {
    addIcons({ add, trash, create, arrowBack });
    this.loadCategories();
  }

  /**
   * Ionic lifecycle hook called when the page is about to enter.
   * 
   * Reloads categories to ensure the list is up-to-date, particularly
   * after returning from other pages or after category modifications.
   * 
   * @returns {void}
   */
  ionViewWillEnter() {
    this.loadCategories();
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
   * Navigates back to the home page.
   * 
   * @returns {void}
   */
  goBack(): void {
    this.router.navigate(['/home']);
  }
}
