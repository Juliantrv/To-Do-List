import { TestBed } from '@angular/core/testing';
import { RemoteConfigService, FeatureFlags } from '@services/remote-config.service';

describe('RemoteConfigService - Feature Flags', () => {
  let service: RemoteConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoteConfigService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debe inicializar con configuración por defecto', () => {
    const config = service.getCurrentConfig();
    expect(config.enableCategories).toBe(true);
    expect(config.enableFilters).toBe(true);
    expect(config.enableDarkMode).toBe(false);
  });

  it('DADO que la aplicación tiene un feature flag configurado CUANDO el valor del feature flag cambia ENTONCES la aplicación activa o desactiva la funcionalidad', (done) => {
    // DADO: Feature flag inicial
    expect(service.getFeatureFlag('enableCategories')).toBe(true);

    // CUANDO: El valor cambia en Remote Config
    service.config$.subscribe(config => {
      if (!config.enableCategories) {
        // ENTONCES: La funcionalidad se desactiva
        expect(config.enableCategories).toBe(false);
        done();
      }
    });

    service.setFeatureFlag('enableCategories', false);
  });

  it('debe persistir los cambios en localStorage', () => {
    // CUANDO: Cambiar un feature flag
    service.setFeatureFlag('enableFilters', false);

    // ENTONCES: Se guarda en localStorage
    const stored = localStorage.getItem('remoteConfig');
    expect(stored).toBeTruthy();
    
    const parsed = JSON.parse(stored!);
    expect(parsed.enableFilters).toBe(false);
  });

  it('debe cargar configuración desde localStorage al inicializar', () => {
    // DADO: Configuración guardada previamente
    const customConfig: FeatureFlags = {
      enableCategories: false,
      enableFilters: false,
      enableDarkMode: true
    };
    localStorage.setItem('remoteConfig', JSON.stringify(customConfig));

    // CUANDO: Crear nuevo servicio (resetear TestBed para obtener nueva instancia)
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const newService = TestBed.inject(RemoteConfigService);

    // ENTONCES: Carga la configuración guardada
    const config = newService.getCurrentConfig();
    expect(config.enableCategories).toBe(false);
    expect(config.enableFilters).toBe(false);
    expect(config.enableDarkMode).toBe(true);
  });

  it('debe actualizar múltiples feature flags a la vez', () => {
    // CUANDO: Actualizar varios flags
    service.updateConfig({
      enableCategories: false,
      enableDarkMode: true
    });

    // ENTONCES: Todos se actualizan correctamente
    const config = service.getCurrentConfig();
    expect(config.enableCategories).toBe(false);
    expect(config.enableFilters).toBe(true); // No cambió
    expect(config.enableDarkMode).toBe(true);
  });

  it('debe notificar a los suscriptores cuando cambia la configuración', (done) => {
    let notificationCount = 0;

    service.config$.subscribe(config => {
      notificationCount++;
      if (notificationCount === 2) {
        // Segunda notificación (después del cambio)
        expect(config.enableCategories).toBe(false);
        done();
      }
    });

    service.setFeatureFlag('enableCategories', false);
  });

  it('debe simular fetch de configuración remota', async () => {
    // DADO: Configuración almacenada
    service.setFeatureFlag('enableDarkMode', true);

    // CUANDO: Simular fetch
    await service.fetchAndActivate();

    // ENTONCES: La configuración se mantiene
    const config = service.getCurrentConfig();
    expect(config.enableDarkMode).toBe(true);
  });

  it('debe resetear a valores por defecto', () => {
    // DADO: Configuración personalizada
    service.setFeatureFlag('enableCategories', false);
    service.setFeatureFlag('enableFilters', false);

    // CUANDO: Resetear
    service.resetToDefaults();

    // ENTONCES: Vuelve a defaults
    const config = service.getCurrentConfig();
    expect(config.enableCategories).toBe(true);
    expect(config.enableFilters).toBe(true);
    expect(config.enableDarkMode).toBe(false);
  });

  it('debe manejar errores al cargar desde localStorage corrupto', () => {
    // DADO: localStorage corrupto
    localStorage.setItem('remoteConfig', 'invalid-json{');

    // CUANDO: Crear servicio (resetear TestBed para obtener nueva instancia)
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const newService = TestBed.inject(RemoteConfigService);

    // ENTONCES: Usa configuración por defecto
    const config = newService.getCurrentConfig();
    expect(config.enableCategories).toBe(true);
    expect(config.enableFilters).toBe(true);
  });

  it('debe permitir obtener un feature flag específico', () => {
    service.setFeatureFlag('enableDarkMode', true);

    const isDarkModeEnabled = service.getFeatureFlag('enableDarkMode');
    expect(isDarkModeEnabled).toBe(true);
  });
});
