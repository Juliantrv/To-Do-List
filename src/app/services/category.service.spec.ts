import { TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';
import { Category } from '../models/category.model';

describe('CategoryService - Gestión de Categorías', () => {
  let service: CategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('DADO que el usuario está en el módulo de categorías CUANDO ingresa un nombre de categoría y confirma ENTONCES la categoría se agrega a la lista de categorías', () => {
    // DADO: Usuario en módulo de categorías (servicio inicializado)
    localStorage.clear();
    
    // CUANDO: Ingresa nombre y confirma
    const category = service.addCategory('Nueva Categoría', '#3880ff');

    // ENTONCES: La categoría se agrega a la lista
    const categories = service.getCategories();
    expect(categories.length).toBe(1);
    expect(category.name).toBe('Nueva Categoría');
    expect(category.color).toBe('#3880ff');
    expect(category.id).toBeTruthy();
    expect(category.createdAt).toBeInstanceOf(Date);
  });

  it('debe agregar múltiples categorías correctamente', () => {
    localStorage.clear();
    
    const cat1 = service.addCategory('Categoría 1', '#ff0000');
    const cat2 = service.addCategory('Categoría 2', '#00ff00');
    const cat3 = service.addCategory('Categoría 3', '#0000ff');

    const categories = service.getCategories();
    expect(categories.length).toBe(3);
    expect(categories.find(c => c.id === cat1.id)?.name).toBe('Categoría 1');
    expect(categories.find(c => c.id === cat2.id)?.name).toBe('Categoría 2');
    expect(categories.find(c => c.id === cat3.id)?.name).toBe('Categoría 3');
  });

  it('debe persistir categorías en localStorage', () => {
    localStorage.clear();
    
    service.addCategory('Categoría Persistente', '#123456');

    const storedCategories = localStorage.getItem('categories');
    expect(storedCategories).toBeTruthy();
    
    const parsedCategories = JSON.parse(storedCategories!);
    expect(parsedCategories.length).toBe(1);
    expect(parsedCategories[0].name).toBe('Categoría Persistente');
    expect(parsedCategories[0].color).toBe('#123456');
  });

  it('debe usar color predeterminado si no se especifica', () => {
    localStorage.clear();
    
    const category = service.addCategory('Sin Color');
    
    expect(category.color).toBe('#3880ff');
  });

  it('debe permitir agregar categoría con icono', () => {
    localStorage.clear();
    
    const category = service.addCategory('Con Icono', '#ff0000', 'star');
    
    expect(category.icon).toBe('star');
  });

  it('debe obtener categoría por ID', () => {
    localStorage.clear();
    
    const category = service.addCategory('Buscar por ID', '#123456');
    const found = service.getCategoryById(category.id);
    
    expect(found).toBeTruthy();
    expect(found?.name).toBe('Buscar por ID');
  });

  it('debe retornar null si la categoría no existe', () => {
    const found = service.getCategoryById('id-inexistente');
    expect(found).toBeNull();
  });

  it('debe actualizar una categoría existente', () => {
    localStorage.clear();
    
    const category = service.addCategory('Original', '#000000');
    category.name = 'Modificado';
    category.color = '#ffffff';
    
    service.updateCategory(category);
    
    const updated = service.getCategoryById(category.id);
    expect(updated?.name).toBe('Modificado');
    expect(updated?.color).toBe('#ffffff');
  });

  it('debe eliminar una categoría correctamente', () => {
    localStorage.clear();
    
    const cat1 = service.addCategory('Categoría 1');
    const cat2 = service.addCategory('Categoría 2');
    
    const deleted = service.deleteCategory(cat1.id);
    
    expect(deleted).toBe(true);
    
    const categories = service.getCategories();
    expect(categories.length).toBe(1);
    expect(categories[0].id).toBe(cat2.id);
  });

  it('debe retornar false al eliminar categoría inexistente', () => {
    const deleted = service.deleteCategory('id-inexistente');
    expect(deleted).toBe(false);
  });

  it('debe mantener integridad de datos después de múltiples operaciones', () => {
    localStorage.clear();
    
    // Agregar
    const cat1 = service.addCategory('Cat 1', '#111111');
    const cat2 = service.addCategory('Cat 2', '#222222');
    const cat3 = service.addCategory('Cat 3', '#333333');
    
    // Actualizar
    cat2.name = 'Cat 2 Modificada';
    service.updateCategory(cat2);
    
    // Eliminar
    service.deleteCategory(cat1.id);
    
    // Verificar
    const categories = service.getCategories();
    expect(categories.length).toBe(2);
    expect(categories.find(c => c.id === cat2.id)?.name).toBe('Cat 2 Modificada');
    expect(categories.find(c => c.id === cat3.id)).toBeTruthy();
    expect(categories.find(c => c.id === cat1.id)).toBeUndefined();
  });

  // ========== EDITAR CATEGORÍA ==========

  it('DADO que existe una categoría CUANDO el usuario modifica su nombre y guarda los cambios ENTONCES la categoría muestra el nombre actualizado', () => {
    localStorage.clear();
    
    // DADO: Existe una categoría
    const category = service.addCategory('Nombre Original', '#ff0000');
    const categoryId = category.id;

    // CUANDO: Modifica su nombre y guarda
    const updated = service.updateCategoryName(categoryId, 'Nombre Actualizado');

    // ENTONCES: La categoría muestra el nombre actualizado
    expect(updated).toBe(true);
    
    const categories = service.getCategories();
    const updatedCategory = categories.find(c => c.id === categoryId);
    
    expect(updatedCategory?.name).toBe('Nombre Actualizado');
    expect(updatedCategory?.color).toBe('#ff0000'); // Color se mantiene
  });

  it('debe persistir el nombre actualizado en localStorage', () => {
    localStorage.clear();
    
    const category = service.addCategory('Original');
    service.updateCategoryName(category.id, 'Modificado');

    const storedCategories = localStorage.getItem('categories');
    expect(storedCategories).toBeTruthy();
    
    const parsedCategories = JSON.parse(storedCategories!);
    expect(parsedCategories[0].name).toBe('Modificado');
  });

  it('debe retornar false al intentar actualizar categoría inexistente', () => {
    const updated = service.updateCategoryName('id-inexistente', 'Nuevo Nombre');
    expect(updated).toBe(false);
  });

  it('debe detectar nombres de categorías duplicados', () => {
    localStorage.clear();
    
    service.addCategory('Personal');
    service.addCategory('Trabajo');

    const exists = service.categoryNameExists('Personal');
    expect(exists).toBe(true);
    
    const notExists = service.categoryNameExists('Inexistente');
    expect(notExists).toBe(false);
  });

  it('debe permitir mismo nombre al editar la misma categoría', () => {
    localStorage.clear();
    
    const category = service.addCategory('Personal');
    
    // Al editar, se excluye la misma categoría
    const exists = service.categoryNameExists('Personal', category.id);
    expect(exists).toBe(false);
  });

  it('debe detectar duplicados case-insensitive', () => {
    localStorage.clear();
    
    service.addCategory('Personal');
    
    expect(service.categoryNameExists('personal')).toBe(true);
    expect(service.categoryNameExists('PERSONAL')).toBe(true);
    expect(service.categoryNameExists('PeRsOnAl')).toBe(true);
  });

  it('debe mantener otros atributos al actualizar solo el nombre', () => {
    localStorage.clear();
    
    const category = service.addCategory('Original', '#123456', 'star');
    const originalDate = category.createdAt;
    
    service.updateCategoryName(category.id, 'Modificado');
    
    const updated = service.getCategoryById(category.id);
    expect(updated?.name).toBe('Modificado');
    expect(updated?.color).toBe('#123456');
    expect(updated?.icon).toBe('star');
    expect(updated?.createdAt).toEqual(originalDate);
  });

  it('debe actualizar múltiples veces la misma categoría', () => {
    localStorage.clear();
    
    const category = service.addCategory('Versión 1');
    
    service.updateCategoryName(category.id, 'Versión 2');
    let updated = service.getCategoryById(category.id);
    expect(updated?.name).toBe('Versión 2');
    
    service.updateCategoryName(category.id, 'Versión 3');
    updated = service.getCategoryById(category.id);
    expect(updated?.name).toBe('Versión 3');
    
    service.updateCategoryName(category.id, 'Versión Final');
    updated = service.getCategoryById(category.id);
    expect(updated?.name).toBe('Versión Final');
  });

  // ========== ELIMINAR CATEGORÍA ==========

  it('DADO que existe una categoría CUANDO el usuario decide eliminarla ENTONCES la categoría desaparece de la lista', () => {
    localStorage.clear();
    
    // DADO: Existen categorías
    const cat1 = service.addCategory('Categoría 1', '#111111');
    const cat2 = service.addCategory('Categoría 2', '#222222');
    const cat3 = service.addCategory('Categoría 3', '#333333');
    
    let categories = service.getCategories();
    expect(categories.length).toBe(3);

    // CUANDO: Usuario decide eliminar categoría 2
    const deleted = service.deleteCategory(cat2.id);

    // ENTONCES: La categoría desaparece de la lista
    expect(deleted).toBe(true);
    
    categories = service.getCategories();
    expect(categories.length).toBe(2);
    expect(categories.find(c => c.id === cat2.id)).toBeUndefined();
    expect(categories.find(c => c.id === cat1.id)).toBeTruthy();
    expect(categories.find(c => c.id === cat3.id)).toBeTruthy();
  });

  it('debe actualizar localStorage después de eliminar', () => {
    localStorage.clear();
    
    const cat1 = service.addCategory('Permanente 1');
    const cat2 = service.addCategory('A Eliminar');
    const cat3 = service.addCategory('Permanente 2');

    service.deleteCategory(cat2.id);

    const storedCategories = localStorage.getItem('categories');
    expect(storedCategories).toBeTruthy();
    
    const parsedCategories = JSON.parse(storedCategories!);
    expect(parsedCategories.length).toBe(2);
    expect(parsedCategories.find((c: Category) => c.id === cat2.id)).toBeUndefined();
    expect(parsedCategories.find((c: Category) => c.id === cat1.id)).toBeTruthy();
    expect(parsedCategories.find((c: Category) => c.id === cat3.id)).toBeTruthy();
  });

  it('debe eliminar la primera categoría de la lista', () => {
    localStorage.clear();
    
    const cat1 = service.addCategory('Primera');
    const cat2 = service.addCategory('Segunda');
    const cat3 = service.addCategory('Tercera');

    service.deleteCategory(cat1.id);

    const categories = service.getCategories();
    expect(categories.length).toBe(2);
    expect(categories[0].id).toBe(cat2.id);
    expect(categories[1].id).toBe(cat3.id);
  });

  it('debe eliminar la última categoría de la lista', () => {
    localStorage.clear();
    
    const cat1 = service.addCategory('Primera');
    const cat2 = service.addCategory('Segunda');
    const cat3 = service.addCategory('Tercera');

    service.deleteCategory(cat3.id);

    const categories = service.getCategories();
    expect(categories.length).toBe(2);
    expect(categories[0].id).toBe(cat1.id);
    expect(categories[1].id).toBe(cat2.id);
  });

  it('debe eliminar todas las categorías una por una', () => {
    localStorage.clear();
    
    const cat1 = service.addCategory('Cat 1');
    const cat2 = service.addCategory('Cat 2');
    const cat3 = service.addCategory('Cat 3');

    service.deleteCategory(cat1.id);
    expect(service.getCategories().length).toBe(2);

    service.deleteCategory(cat2.id);
    expect(service.getCategories().length).toBe(1);

    service.deleteCategory(cat3.id);
    expect(service.getCategories().length).toBe(0);

    const storedCategories = localStorage.getItem('categories');
    expect(JSON.parse(storedCategories!)).toEqual([]);
  });

  it('debe retornar false al eliminar categoría que no existe', () => {
    localStorage.clear();
    
    service.addCategory('Existente');
    
    const deleted = service.deleteCategory('id-inexistente');
    expect(deleted).toBe(false);
    
    expect(service.getCategories().length).toBe(1);
  });

  it('debe eliminar múltiples categorías en secuencia sin afectar las demás', () => {
    localStorage.clear();
    
    const cats = [];
    for (let i = 1; i <= 10; i++) {
      cats.push(service.addCategory(`Categoría ${i}`));
    }

    // Eliminar categorías pares
    service.deleteCategory(cats[1].id); // Cat 2
    service.deleteCategory(cats[3].id); // Cat 4
    service.deleteCategory(cats[5].id); // Cat 6
    service.deleteCategory(cats[7].id); // Cat 8
    service.deleteCategory(cats[9].id); // Cat 10

    const remaining = service.getCategories();
    expect(remaining.length).toBe(5);
    expect(remaining.find(c => c.name === 'Categoría 1')).toBeTruthy();
    expect(remaining.find(c => c.name === 'Categoría 3')).toBeTruthy();
    expect(remaining.find(c => c.name === 'Categoría 5')).toBeTruthy();
    expect(remaining.find(c => c.name === 'Categoría 7')).toBeTruthy();
    expect(remaining.find(c => c.name === 'Categoría 9')).toBeTruthy();
  });

  it('debe mantener el orden de las categorías restantes después de eliminar', () => {
    localStorage.clear();
    
    const cat1 = service.addCategory('A');
    const cat2 = service.addCategory('B');
    const cat3 = service.addCategory('C');
    const cat4 = service.addCategory('D');

    service.deleteCategory(cat2.id);

    const categories = service.getCategories();
    expect(categories[0].name).toBe('A');
    expect(categories[1].name).toBe('C');
    expect(categories[2].name).toBe('D');
  });
});
