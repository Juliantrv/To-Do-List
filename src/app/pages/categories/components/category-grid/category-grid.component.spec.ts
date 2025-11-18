import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CategoryGridComponent } from './category-grid.component';

describe('CategoryGridComponent', () => {
  let component: CategoryGridComponent;
  let fixture: ComponentFixture<CategoryGridComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CategoryGridComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
