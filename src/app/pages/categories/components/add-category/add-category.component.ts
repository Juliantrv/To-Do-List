import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonCardContent, IonItem, IonInput, IonButton, IonIcon, IonCard } from "@ionic/angular/standalone";

// Services
import { CategoryService } from '@services/category.service';
import { ToastService } from '@services/toast.service';

/**
 * Component for adding new categories to the application.
 * 
 * This component provides a form interface that allows users to create new
 * task categories with custom names and colors. It validates category names
 * to prevent duplicates, offers a color palette for selection, and provides
 * feedback via toast notifications. The component integrates with category
 * and toast services for data management and user feedback.
 */
@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
  imports: [IonCard, IonCardContent, IonItem, IonInput, IonButton, IonIcon, FormsModule]
})
export class AddCategoryComponent {

  /**
   * Output event emitter to notify parent component to reload categories.
   * @type {OutputEmitterRef<void>}
   */
  loadCategories = output<void>();

  /**
   * Category service for managing category operations.
   * @private
   */
  private categoryService = inject(CategoryService);
  
  /**
   * Toast service for displaying notification messages.
   * @private
   */
  private toastService = inject(ToastService);

  /**
   * Signal holding the name of the new category being created.
   * @type {WritableSignal<string>}
   */
  newCategoryName = signal<string>('');
  
  /**
   * Signal containing the array of available color options for categories.
   * @type {WritableSignal<string[]>}
   */
  availableColors = signal<string[]>([
    '#3880ff', // primary
    '#2dd36f', // success
    '#ffc409', // warning
    '#eb445a', // danger
    '#92949c', // medium
    '#5260ff', // secondary
    '#3dc2ff', // tertiary
    '#222428', // dark
  ]);
  
  /**
   * Signal holding the currently selected color for the new category.
   * @type {WritableSignal<string>}
   */
  selectedColor = signal<string>('#3880ff');
  

  /**
   * Creates and adds a new category.
   * 
   * Validates that the category name is not empty and doesn't already exist.
   * If validation passes, creates the category with the selected name and color,
   * resets the form fields, emits an event to reload categories, and displays
   * a success toast notification. Shows a warning if the name already exists.
   * 
   * @returns {Promise<void>} Promise that resolves when the category is added.
   */
  async addCategory(): Promise<void> {
    const categoryName = this.newCategoryName().trim();
    
    if (categoryName) {
      // Validate if the name already exists
      if (this.categoryService.categoryNameExists(categoryName)) {
        await this.toastService.showToast('Ya existe una categoría con ese nombre', 'warning');
        return;
      }
      
      this.categoryService.addCategory(categoryName, this.selectedColor());
      this.newCategoryName.set('');
      this.selectedColor.set('#3880ff');
      this.loadCategories.emit();
      
      await this.toastService.showToast('✓ Categoría agregada correctamente', 'success');
    }
  }

  /**
   * Sets the selected color for the new category.
   * 
   * Updates the selectedColor signal with the user's color choice.
   * 
   * @param {string} color - The hexadecimal color code to select.
   * @returns {void}
   */
  selectColor(color: string): void {
    this.selectedColor.set(color);
  }

}
