import { inject, Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RemoteConfig, fetchAndActivate, getValue } from '@angular/fire/remote-config';

/**
 * Interface for application feature flags.
 * 
 * Defines the available feature toggles that can be controlled remotely
 * or through local storage during development.
 */
export interface FeatureFlags {
  /**
   * Flag to enable/disable categories functionality.
   */
  enableCategories: boolean;
  
  /**
   * Flag to enable/disable task filters functionality.
   */
  enableFilters: boolean;
  
  /**
   * Flag to enable/disable dark mode theme.
   */
  enableDarkMode: boolean;
}

/**
 * Service for managing remote configuration and feature flags.
 * 
 * This service integrates with Firebase Remote Config to dynamically control
 * feature availability. It falls back to localStorage for development and testing
 * when Firebase is not available. Provides reactive configuration updates through
 * observables.
 * 
 * @Injectable
 */
@Injectable({
  providedIn: 'root'
})
export class RemoteConfigService {
  /**
   * Angular injector for lazy loading of Firebase Remote Config.
   * @private
   * @readonly
   */
  private readonly injector = inject(Injector);
  
  /**
   * Firebase Remote Config instance.
   * @private
   */
  private remoteConfig?: RemoteConfig;

  /**
   * Storage key for persisting configuration in localStorage.
   * @private
   * @readonly
   */
  private readonly STORAGE_KEY = 'remoteConfig';
  
  /**
   * Default configuration values for feature flags.
   * @private
   * @readonly
   */
  private readonly DEFAULT_CONFIG: FeatureFlags = {
    enableCategories: true,
    enableFilters: true,
    enableDarkMode: false
  };

  /**
   * BehaviorSubject holding the current configuration state.
   * @private
   */
  private configSubject: BehaviorSubject<FeatureFlags>;
  
  /**
   * Observable stream of configuration updates.
   * @public
   */
  public config$: Observable<FeatureFlags>;

  constructor() {
    const storedConfig = this.loadConfigFromStorage();
    this.configSubject = new BehaviorSubject<FeatureFlags>(storedConfig);
    this.config$ = this.configSubject.asObservable();
  }

  /**
   * Fetches and activates remote configuration from Firebase.
   * 
   * Attempts to retrieve configuration from Firebase Remote Config. If Firebase
   * is unavailable, falls back to localStorage configuration. Updates the
   * configuration observable with the retrieved values.
   * 
   * @returns {Promise<void>} Promise that resolves when configuration is fetched and activated.
   */
  async fetchAndActivate(): Promise<void> {
    try {
      if (!this.remoteConfig) {
        this.remoteConfig = this.injector.get(RemoteConfig);
      }
      
      await fetchAndActivate(this.remoteConfig);
      
      const config: FeatureFlags = {
        enableCategories: getValue(this.remoteConfig, 'enableCategories').asBoolean(),
        enableFilters: getValue(this.remoteConfig, 'enableFilters').asBoolean(),
        enableDarkMode: getValue(this.remoteConfig, 'enableDarkMode').asBoolean()
      };
      
      this.configSubject.next(config);
    } catch (error) {
      console.warn('Firebase Remote Config no disponible, usando localStorage:', error);
      const storedConfig = this.loadConfigFromStorage();
      this.configSubject.next(storedConfig);
    }
  }

  /**
   * Retrieves the current configuration state.
   * 
   * @returns {FeatureFlags} Current feature flags configuration.
   */
  getCurrentConfig(): FeatureFlags {
    return this.configSubject.value;
  }

  /**
   * Retrieves the value of a specific feature flag.
   * 
   * @param {keyof FeatureFlags} flag - Name of the feature flag to retrieve.
   * @returns {boolean} Current value of the specified feature flag.
   */
  getFeatureFlag(flag: keyof FeatureFlags): boolean {
    return this.configSubject.value[flag];
  }

  /**
   * Updates a specific feature flag value.
   * 
   * Simulates a Remote Config change by updating the flag locally and
   * persisting it to localStorage.
   * 
   * @param {keyof FeatureFlags} flag - Name of the feature flag to update.
   * @param {boolean} value - New value for the feature flag.
   * @returns {void}
   */
  setFeatureFlag(flag: keyof FeatureFlags, value: boolean): void {
    const currentConfig = this.configSubject.value;
    const newConfig = { ...currentConfig, [flag]: value };
    this.configSubject.next(newConfig);
    this.saveConfigToStorage(newConfig);
  }

  /**
   * Updates multiple configuration values at once.
   * 
   * Simulates a full synchronization with Remote Config by merging the
   * provided configuration with current values and persisting to localStorage.
   * 
   * @param {Partial<FeatureFlags>} config - Partial configuration object with values to update.
   * @returns {void}
   */
  updateConfig(config: Partial<FeatureFlags>): void {
    const currentConfig = this.configSubject.value;
    const newConfig = { ...currentConfig, ...config };
    this.configSubject.next(newConfig);
    this.saveConfigToStorage(newConfig);
  }

  /**
   * Resets configuration to default values.
   * 
   * Restores all feature flags to their original default state and
   * persists the reset configuration to localStorage.
   * 
   * @returns {void}
   */
  resetToDefaults(): void {
    this.configSubject.next(this.DEFAULT_CONFIG);
    this.saveConfigToStorage(this.DEFAULT_CONFIG);
  }

  /**
   * Loads configuration from localStorage.
   * 
   * Attempts to retrieve and parse stored configuration. Merges with default
   * configuration to ensure all properties exist. Falls back to defaults on error.
   * 
   * @private
   * @returns {FeatureFlags} Loaded configuration or default values.
   */
  private loadConfigFromStorage(): FeatureFlags {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge con defaults para asegurar que existan todas las propiedades
        return { ...this.DEFAULT_CONFIG, ...parsed };
      }
    } catch (error) {
      console.error('Error al cargar Remote Config:', error);
    }
    return this.DEFAULT_CONFIG;
  }

  /**
   * Saves configuration to localStorage.
   * 
   * Persists the current configuration state to localStorage as JSON.
   * Logs error if save operation fails.
   * 
   * @private
   * @param {FeatureFlags} config - Configuration object to save.
   * @returns {void}
   */
  private saveConfigToStorage(config: FeatureFlags): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Error al guardar Remote Config:', error);
    }
  }
}
