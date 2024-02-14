import { TestBed } from '@angular/core/testing';

import { ExpenseModalService } from './expense-modal.service';

describe('ExpenseModalService', () => {
  let service: ExpenseModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
