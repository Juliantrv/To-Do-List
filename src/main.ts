import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideRemoteConfig, getRemoteConfig } from '@angular/fire/remote-config';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    
    // Inicializar Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    
    // Configurar Remote Config
    provideRemoteConfig(() => {
      const remoteConfig = getRemoteConfig();
      // remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hora
      remoteConfig.settings.minimumFetchIntervalMillis = 0;
      
      // Valores por defecto
      remoteConfig.defaultConfig = {
        'enableCategories': true,
        'enableFilters': true,
        'enableDarkMode': false
      };
      
      return remoteConfig;
    })
  ],
});
