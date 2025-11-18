import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonButton,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/angular/standalone';
import { RemoteConfigService, FeatureFlags } from '@services/remote-config.service';

/**
 * Settings page component for managing application feature flags.
 * 
 * This page allows users to view and toggle feature flags that control
 * various aspects of the application (categories, filters, dark mode).
 * It integrates with RemoteConfigService to manage and persist configuration
 * changes, and provides options to reset to defaults or sync with remote config.
 */
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonToggle,
    IonButton,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ]
})
export class SettingsPage {
  /**
   * Current feature flags configuration.
   * @type {FeatureFlags}
   */
  config: FeatureFlags;

  /**
   * Creates an instance of SettingsPage.
   * 
   * Initializes the component with current remote configuration and subscribes
   * to configuration changes to keep the UI in sync.
   * 
   * @param {RemoteConfigService} remoteConfigService - Service for managing feature flags.
   */
  constructor(private remoteConfigService: RemoteConfigService) {
    this.config = this.remoteConfigService.getCurrentConfig();
    
    // Suscribirse a cambios
    this.remoteConfigService.config$.subscribe(config => {
      this.config = config;
    });
  }

  /**
   * Toggles the state of a specific feature flag.
   * 
   * Updates the feature flag value and persists the change through the
   * RemoteConfigService.
   * 
   * @param {keyof FeatureFlags} flag - The name of the feature flag to toggle.
   * @param {boolean} enabled - The new enabled/disabled state for the flag.
   * @returns {void}
   */
  toggleFeature(flag: keyof FeatureFlags, enabled: boolean): void {
    this.remoteConfigService.setFeatureFlag(flag, enabled);
  }

  /**
   * Resets all feature flags to their default values.
   * 
   * Restores the original configuration by resetting all feature flags
   * to the predefined defaults in RemoteConfigService.
   * 
   * @returns {void}
   */
  resetToDefaults(): void {
    this.remoteConfigService.resetToDefaults();
  }

  /**
   * Synchronizes configuration with Firebase Remote Config.
   * 
   * Fetches the latest configuration from Firebase Remote Config server
   * and activates it, updating the local configuration accordingly.
   * 
   * @returns {Promise<void>} Promise that resolves when sync is complete.
   */
  async syncRemoteConfig(): Promise<void> {
    await this.remoteConfigService.fetchAndActivate();
  }
}
