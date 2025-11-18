import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { IonItemSliding, IonItem, IonList, IonLabel, IonChip, IonIcon, IonItemOptions, IonItemOption, AlertController } from "@ionic/angular/standalone";

// Models
import { Category } from '@models/category.model';
import { CategoryService } from '@services/category.service';
import { ToastService } from '@services/toast.service';

/**
 * Component for displaying and managing a grid of categories.
 * 
 * This component renders a list of categories with interactive features including
 * category editing and deletion with confirmation dialogs. It uses Ionic sliding
 * items for swipe-to-edit/delete functionality and integrates with category and
 * toast services for data management and user feedback. Validates category names
 * to prevent duplicates and empty names.
 */
@Component({
  selector: 'app-category-grid',
  templateUrl: './category-grid.component.html',
  styleUrls: ['./category-grid.component.scss'],
  imports: [IonItemOption, IonItemOptions, IonIcon, IonChip, IonLabel, IonList, IonItem, IonItemSliding, CommonModule]
})
export class CategoryGridComponent {
  /**
   * Input signal containing the array of categories to display.
   * @type {InputSignal<Category[]>}
   */
  categories = input<Category[]>([]);
  
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
   * Displays a dialog to edit a category's name.
   * 
   * Shows an Ionic alert with an input field pre-filled with the current category name.
   * Validates that the new name is not empty and doesn't duplicate an existing category.
   * If validation passes, updates the category through the service.
   * 
   * @param {Category} category - The category object to edit.
   * @returns {Promise<void>} Promise that resolves when the alert is presented.
   */
  async editCategory(category: Category): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Editar categoría',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre de la categoría',
          value: category.name,
          attributes: {
            maxlength: 50
          }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            const newName = data.name?.trim();
            
            if (!newName) {
              this.toastService.showToast('El nombre no puede estar vacío', 'warning');
              return false;
            }
            
            if (newName === category.name) {
              return true; // No hay cambios
            }
            
            // Validar si el nombre ya existe
            if (this.categoryService.categoryNameExists(newName, category.id)) {
              this.toastService.showToast('Ya existe una categoría con ese nombre', 'warning');
              return false;
            }
            
            this.performEdit(category, newName);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Executes the category edit operation.
   * 
   * Updates the category name in the service, emits an event to reload categories,
   * and displays a success toast notification showing the old and new names.
   * 
   * @private
   * @param {Category} category - The category object to update.
   * @param {string} newName - The new name for the category.
   * @returns {Promise<void>} Promise that resolves when edit is complete.
   */
  private async performEdit(category: Category, newName: string): Promise<void> {
    const oldName = category.name;
    category.name = newName;
    
    this.categoryService.updateCategory(category);
    this.loadCategories.emit();
    
    await this.toastService.showToast(`✓ Categoría actualizada: "${oldName}" → "${newName}"`, 'success');
  }

  /**
   * Displays a confirmation dialog before deleting a category.
   * 
   * Shows an Ionic alert with options to cancel or confirm the deletion.
   * If confirmed, proceeds to delete the category.
   * 
   * @param {string} categoryId - ID of the category to delete.
   * @returns {Promise<void>} Promise that resolves when alert is presented.
   */
  async deleteCategory(categoryId: string): Promise<void> {
    const category = this.categories()?.find(c => c.id === categoryId);
    if (!category) return;

    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de eliminar la categoría "${category.name}"?`,
      subHeader: 'Esta acción no se puede deshacer',
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
            this.performDelete(categoryId, category.name);
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Executes the category deletion operation.
   * 
   * Removes the category from the service, emits an event to reload categories,
   * and displays a toast notification indicating success or failure.
   * 
   * @private
   * @param {string} categoryId - ID of the category to delete.
   * @param {string} categoryName - Name of the category being deleted for display in notifications.
   * @returns {Promise<void>} Promise that resolves when deletion is complete.
   */
  private async performDelete(categoryId: string, categoryName: string): Promise<void> {
    const deleted = this.categoryService.deleteCategory(categoryId);
    
    if (deleted) {
      this.loadCategories.emit();
      await this.toastService.showToast(`✓ Categoría "${categoryName}" eliminada`, 'danger');
    } else {
      await this.toastService.showToast('Error al eliminar la categoría', 'danger');
    }
  }
}
