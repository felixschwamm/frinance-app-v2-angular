import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseBarComponent } from './expense-bar.component';

describe('ExpenseBarComponent', () => {
  let component: ExpenseBarComponent;
  let fixture: ComponentFixture<ExpenseBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpenseBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
