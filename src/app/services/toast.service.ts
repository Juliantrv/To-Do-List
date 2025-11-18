import { inject, Injectable } from '@angular/core';
import { ToastController } from "@ionic/angular/standalone";

/**
 * Service for displaying toast notifications throughout the application.
 * 
 * This service provides a centralized way to show toast messages to users,
 * with customizable colors and a consistent display duration and position.
 * 
 * @Injectable
 */
@Injectable({
    providedIn: 'root'
})
export class ToastService {

    /**
     * Ionic Toast Controller for creating and managing toast notifications.
     * @private
     */
    private toastController = inject(ToastController);

    /**
     * Displays a toast notification at the bottom of the screen.
     * 
     * The toast will automatically dismiss after 2 seconds.
     * 
     * @param {string} message - The message to display in the toast.
     * @param {string} [color='primary'] - The color theme for the toast (e.g., 'primary', 'success', 'warning', 'danger').
     * @returns {Promise<void>} A promise that resolves when the toast is presented.
     */
    async showToast(message: string, color: string = 'primary'): Promise<void> {
        const toast = await this.toastController.create({
        message,
        duration: 2000,
        position: 'bottom',
        color
        });
        
        await toast.present();
    }
}