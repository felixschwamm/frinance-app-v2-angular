import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseListService {

  constructor() { }

  selectedMonth$: BehaviorSubject<{ year: number, month: number }> = new BehaviorSubject({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 });

  changeSelectedMonth(selectedMonth: { year: number, month: number }): void {
    this.selectedMonth$.next(selectedMonth);
  }

}
