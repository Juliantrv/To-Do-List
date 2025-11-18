import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TasksGridComponent } from './tasks-grid.component';

describe('TasksGridComponent', () => {
  let component: TasksGridComponent;
  let fixture: ComponentFixture<TasksGridComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ TasksGridComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(TasksGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
