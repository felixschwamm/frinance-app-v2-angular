import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Expense } from '../../types';
import { ExpenseListItemComponent } from "../expense-list-item/expense-list-item.component";
import { CommonModule } from '@angular/common';
import { BackendService } from '../../services/backend.service';
import { SelectComponent } from "../select/select.component";
import { BehaviorSubject, Observable, Subject, combineLatest, debounceTime, map, of, skip } from 'rxjs';
import { MonthSelectComponent } from "../month-select/month-select.component";
import { ExpenseListService } from '../../services/expense-list.service';

@Component({
    selector: 'app-expense-list',
    standalone: true,
    templateUrl: './expense-list.component.html',
    styleUrl: './expense-list.component.scss',
    imports: [ExpenseListItemComponent, CommonModule, SelectComponent, MonthSelectComponent]
})
export class ExpenseListComponent implements OnInit {

  constructor(
    private backendService: BackendService,
    public expenseListService: ExpenseListService
  ) {}

  selectedSorting$ = new BehaviorSubject<number>(0);
  maxNumberOfExpenses$ = new BehaviorSubject<number>(5);
  selectedMonthDebounced$ = this.expenseListService.selectedMonth$.pipe(
    debounceTime(300)
  );

  ngOnInit(): void {
      this.selectedMonthDebounced$.pipe(skip(1)).subscribe(selectedMonth => {
        this.maxNumberOfExpenses$.next(5);
        this.backendService.updateExpensesForMonth(selectedMonth.year, selectedMonth.month);
      });
  }

  onSelectedMonthChange(selectedMonth: { year: number, month: number }): void {
    this.expenseListService.selectedMonth$.next(selectedMonth);
  }

  expenses$: Observable<null | Expense[]> = combineLatest([this.backendService.expensesForMonth$, this.selectedSorting$, this.selectedMonthDebounced$]).pipe(
    map(([expensesForMonth, selectedSorting, selectedMonth]) => {
      const key = `${selectedMonth.year}-${selectedMonth.month}`;
      const expenses =  expensesForMonth[key] || null;
      if (expenses === null) {
        return null;
      }
      // if selectedSorting is 0, sort by newest and if 1 sort by most expensive
      if (selectedSorting === 0) {
        return expenses.sort((a, b) => b.date.getTime() - a.date.getTime());
      } else {
        return expenses.sort((a, b) => b.amount - a.amount);
      }
    })
  );

  expensesLimited$: Observable<null | Expense[]> = combineLatest([this.expenses$, this.maxNumberOfExpenses$]).pipe(
    map(([expenses, maxNumberOfExpenses]) => {
      if (expenses === null) {
        return null;
      }
      return expenses.slice(0, maxNumberOfExpenses);
    })
  );

  canDisplayMore$: Observable<boolean> = combineLatest([this.expenses$, this.maxNumberOfExpenses$]).pipe(
    map(([expenses, maxNumberOfExpenses]) => {
      if (expenses === null) {
        return false;
      }
      return expenses.length > maxNumberOfExpenses;
    })
  );

  displayButton$: Observable<boolean> = this.expenses$.pipe(
    map(expenses => expenses !== null && expenses.length > 5)
  );

  handleCollapseList(): void {
    this.maxNumberOfExpenses$.next(5);
  }

  handleLoadMore(): void {
    this.maxNumberOfExpenses$.next(this.maxNumberOfExpenses$.value + 5);
  }

  handleSelectedSortingChange(selectedSorting: number): void {
    this.selectedSorting$.next(selectedSorting);
  }

}
