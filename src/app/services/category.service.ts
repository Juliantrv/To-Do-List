import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';

/**
 * Service for managing categories in the To-Do List application.
 * 
 * This service handles all CRUD operations for task categories, storing them
 * in localStorage. It provides default categories on initialization and methods
 * to create, read, update, and delete categories. Categories are used to organize
 * and filter tasks throughout the application.
 * 
 * @Injectable
 */
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  /**
   * Storage key used to persist categories in localStorage.
   * @private
   * @readonly
   */
  private readonly STORAGE_KEY = 'categories';
  
  /**
   * Default categories created on first initialization.
   * @private
   */
  private defaultCategories: Omit<Category, 'id' | 'createdAt'>[] = [
    { name: 'Personal', color: '#3880ff', icon: 'person' },
    { name: 'Trabajo', color: '#2dd36f', icon: 'briefcase' },
    { name: 'Hogar', color: '#ffc409', icon: 'home' },
    { name: 'Salud', color: '#eb445a', icon: 'fitness' }
  ];

  constructor() {
    this.initializeDefaultCategories();
  }

  /**
   * Initializes default categories if none exist in storage.
   * 
   * @private
   * @returns {void}
   */
  private initializeDefaultCategories(): void {
    const existingCategories = this.getCategories();
    
    if (existingCategories.length === 0) {
      this.defaultCategories.forEach(cat => {
        this.addCategory(cat.name, cat.color, cat.icon);
      });
    }
  }

  /**
   * Retrieves all categories from local storage.
   * 
   * @returns {Category[]} Array of categories with dates properly parsed.
   */
  getCategories(): Category[] {
    try {
      const categoriesJson = localStorage.getItem(this.STORAGE_KEY);
      if (categoriesJson) {
        const categories = JSON.parse(categoriesJson);
        return categories.map((cat: any) => ({
          ...cat,
          createdAt: new Date(cat.createdAt)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      return [];
    }
  }

  /**
   * Retrieves a specific category by its ID.
   * 
   * @param {string} categoryId - ID of the category to retrieve.
   * @returns {Category | null} The category object or null if not found.
   */
  getCategoryById(categoryId: string): Category | null {
    const categories = this.getCategories();
    return categories.find(cat => cat.id === categoryId) || null;
  }

  /**
   * Adds a new category to local storage.
   * 
   * @param {string} name - Name of the category.
   * @param {string} [color='#3880ff'] - Color in hexadecimal format for the category.
   * @param {string} [icon] - Optional icon name from Ionic icons.
   * @returns {Category} The newly created category.
   */
  addCategory(name: string, color: string = '#3880ff', icon?: string): Category {
    const categories = this.getCategories();
    
    const newCategory: Category = {
      id: this.generateId(),
      name,
      color,
      icon,
      createdAt: new Date()
    };

    categories.push(newCategory);
    this.saveCategories(categories);
    
    return newCategory;
  }

  /**
   * Updates an existing category in local storage.
   * 
   * @param {Category} category - The category object with updated properties.
   * @returns {void}
   */
  updateCategory(category: Category): void {
    const categories = this.getCategories();
    const index = categories.findIndex(cat => cat.id === category.id);
    
    if (index !== -1) {
      categories[index] = category;
      this.saveCategories(categories);
    }
  }

  /**
   * Updates only the name of a specific category.
   * 
   * @param {string} categoryId - ID of the category to update.
   * @param {string} newName - New name for the category.
   * @returns {boolean} True if the category was updated, false if not found.
   */
  updateCategoryName(categoryId: string, newName: string): boolean {
    const categories = this.getCategories();
    const category = categories.find(cat => cat.id === categoryId);
    
    if (category) {
      category.name = newName;
      this.updateCategory(category);
      return true;
    }
    
    return false;
  }

  /**
   * Checks if a category name already exists.
   * 
   * Performs case-insensitive comparison to prevent duplicate category names.
   * 
   * @param {string} name - Category name to check.
   * @param {string} [excludeId] - Optional category ID to exclude from the check (useful for updates).
   * @returns {boolean} True if the name exists, false otherwise.
   */
  categoryNameExists(name: string, excludeId?: string): boolean {
    const categories = this.getCategories();
    return categories.some(cat => 
      cat.name.toLowerCase() === name.toLowerCase() && 
      cat.id !== excludeId
    );
  }

  /**
   * Deletes a category from local storage.
   * 
   * @param {string} categoryId - ID of the category to delete.
   * @returns {boolean} True if the category was deleted, false if not found.
   */
  deleteCategory(categoryId: string): boolean {
    const categories = this.getCategories();
    const initialLength = categories.length;
    const filteredCategories = categories.filter(cat => cat.id !== categoryId);
    
    if (filteredCategories.length < initialLength) {
      this.saveCategories(filteredCategories);
      return true;
    }
    
    return false;
  }

  /**
   * Saves the categories array to local storage.
   * 
   * @private
   * @param {Category[]} categories - Array of categories to persist.
   * @returns {void}
   */
  private saveCategories(categories: Category[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error('Error al guardar categorías:', error);
    }
  }

  /**
   * Generates a unique ID for categories.
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
