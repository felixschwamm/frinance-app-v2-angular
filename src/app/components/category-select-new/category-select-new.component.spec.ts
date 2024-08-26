import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySelectNewComponent } from './category-select-new.component';

describe('CategorySelectNewComponent', () => {
  let component: CategorySelectNewComponent;
  let fixture: ComponentFixture<CategorySelectNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorySelectNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategorySelectNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
