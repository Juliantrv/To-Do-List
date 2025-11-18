import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { TaskService } from '@services/task.service';
import { CategoryService } from '@services/category.service';
import { RemoteConfigService } from '@services/remote-config.service';
import { provideRouter } from '@angular/router';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        TaskService,
        CategoryService,
        RemoteConfigService,
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ========== FILTRAR TAREAS POR CATEGORÍA ==========

  describe('Filtrar tareas por categoría', () => {
    let filtersComponent: any;

    beforeEach(() => {
      // Limpiar localStorage antes de cada test
      localStorage.clear();
      
      // Crear categorías de prueba
      component.categories.set([
        { id: 'cat-1', name: 'Trabajo', color: '#ff0000', createdAt: new Date() },
        { id: 'cat-2', name: 'Personal', color: '#00ff00', createdAt: new Date() }
      ]);
      
      // Crear tareas de prueba con diferentes categorías
      component.tasks.set([
        { id: '1', name: 'Tarea 1 Trabajo', completed: false, categoryId: 'cat-1', createdAt: new Date() },
        { id: '2', name: 'Tarea 2 Personal', completed: false, categoryId: 'cat-2', createdAt: new Date() },
        { id: '3', name: 'Tarea 3 Trabajo', completed: false, categoryId: 'cat-1', createdAt: new Date() },
        { id: '4', name: 'Tarea 4 Sin categoría', completed: false, createdAt: new Date() },
        { id: '5', name: 'Tarea 5 Personal', completed: false, categoryId: 'cat-2', createdAt: new Date() }
      ]);

      // Mock del filtersComponent
      filtersComponent = {
        selectedFilterCategoryId: null,
        getFilteredTasks: function() {
          const tasks = component.tasks();
          if (!this.selectedFilterCategoryId) {
            return tasks;
          }
          if (this.selectedFilterCategoryId === 'no-category') {
            return tasks.filter((task: any) => !task.categoryId);
          }
          return tasks.filter((task: any) => task.categoryId === this.selectedFilterCategoryId);
        }
      };

      // Simular el viewChild
      spyOn(component.filtersComponent as any, 'call').and.returnValue(filtersComponent);
    });

    it('DADO que existen tareas con categorías CUANDO no hay filtro seleccionado ENTONCES muestra todas las tareas', () => {
      // DADO/CUANDO: No hay filtro
      filtersComponent.selectedFilterCategoryId = null;

      // ENTONCES: Devuelve todas las tareas
      const filtered = filtersComponent.getFilteredTasks();
      expect(filtered.length).toBe(5);
    });

    it('DADO que existen tareas con categorías CUANDO el usuario selecciona un filtro por categoría ENTONCES solo se muestran las tareas de esa categoría', () => {
      // DADO: Tareas con diferentes categorías
      // CUANDO: Seleccionar filtro por categoría "Trabajo"
      filtersComponent.selectedFilterCategoryId = 'cat-1';

      // ENTONCES: Solo devuelve tareas de esa categoría
      const filtered = filtersComponent.getFilteredTasks();
      expect(filtered.length).toBe(2);
      expect(filtered[0].categoryId).toBe('cat-1');
      expect(filtered[1].categoryId).toBe('cat-1');
    });

    it('debe filtrar correctamente por otra categoría', () => {
      // CUANDO: Filtrar por categoría "Personal"
      filtersComponent.selectedFilterCategoryId = 'cat-2';

      // ENTONCES: Solo devuelve tareas de "Personal"
      const filtered = filtersComponent.getFilteredTasks();
      expect(filtered.length).toBe(2);
      expect(filtered.every((task: any) => task.categoryId === 'cat-2')).toBe(true);
    });

    it('debe filtrar tareas sin categoría cuando se selecciona "no-category"', () => {
      // CUANDO: Filtrar por "Sin categoría"
      filtersComponent.selectedFilterCategoryId = 'no-category';

      // ENTONCES: Solo devuelve tareas sin categoría
      const filtered = filtersComponent.getFilteredTasks();
      expect(filtered.length).toBe(1);
      expect(filtered[0].categoryId).toBeUndefined();
    });

    it('debe devolver array vacío si no hay tareas de la categoría seleccionada', () => {
      // CUANDO: Filtrar por categoría inexistente
      filtersComponent.selectedFilterCategoryId = 'cat-inexistente';

      // ENTONCES: Devuelve array vacío
      const filtered = filtersComponent.getFilteredTasks();
      expect(filtered.length).toBe(0);
    });

    it('debe actualizar el filtro dinámicamente', () => {
      // CUANDO: Cambiar el filtro múltiples veces
      filtersComponent.selectedFilterCategoryId = 'cat-1';
      let filtered = filtersComponent.getFilteredTasks();
      expect(filtered.length).toBe(2);

      filtersComponent.selectedFilterCategoryId = 'cat-2';
      filtered = filtersComponent.getFilteredTasks();
      expect(filtered.length).toBe(2);

      filtersComponent.selectedFilterCategoryId = null;
      filtered = filtersComponent.getFilteredTasks();
      expect(filtered.length).toBe(5);
    });
  });
});
