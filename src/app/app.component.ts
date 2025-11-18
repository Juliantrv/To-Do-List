import { Component, inject, OnInit } from '@angular/core';
import {
  IonApp,
  IonRouterOutlet
} from '@ionic/angular/standalone';
import { RemoteConfigService } from '@services/remote-config.service';

/**
 * Root component of the To-Do List application.
 * 
 * This component serves as the main entry point for the Ionic application,
 * providing the base structure with the router outlet and initializing
 * Firebase Remote Config on application startup.
 * 
 * @implements {OnInit}
 */
@Component({
  selector: 'app-root',
  template: '<ion-app><ion-router-outlet></ion-router-outlet></ion-app>',
  imports: [
    IonApp,
    IonRouterOutlet
  ],
})
export class AppComponent implements OnInit {
  /**
   * Remote Config service for managing feature flags and remote configuration.
   * @private
   */
  private remoteConfigService = inject(RemoteConfigService);

  /**
   * Lifecycle hook that is called after the component is initialized.
   * Fetches and activates Firebase Remote Config settings on app startup.
   * 
   * @returns {void}
   */
  ngOnInit(): void {
    this.remoteConfigService.fetchAndActivate().then(() => {});
  }
}
