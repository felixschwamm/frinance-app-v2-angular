import { Component, OnInit } from '@angular/core';
import { YearPickerComponent } from "../year-picker/year-picker.component";
import { BehaviorSubject, Observable, combineLatest, debounceTime, map, skip, lastValueFrom } from 'rxjs';
import { BackendService } from '../../services/backend.service';
import { CommonModule } from '@angular/common';
import { ExpenseCategory } from '../../types';
import { UtilsService } from '../../services/utils.service';
import { ExpenseListService } from '../../services/expense-list.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
  imports: [YearPickerComponent, CommonModule]
})
export class OverviewComponent implements OnInit {

  constructor(
    private backendService: BackendService,
    public utilsService: UtilsService,
    private expenseListService: ExpenseListService
  ) { }

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();

  MAX_EXPENSE_HEIGHT = 160;

  selectedMonth$: BehaviorSubject<number> = new BehaviorSubject<number>(new Date().getMonth());
  selectedMonthString$ = this.selectedMonth$.pipe(map(month => this.utilsService.getMonthName(month)));
  selectedYear$: BehaviorSubject<number> = new BehaviorSubject<number>(this.currentYear);
  selectedYearDebounced$ = this.selectedYear$.pipe(debounceTime(300));
  selectedYearExpenses$: Observable<{ [category in ExpenseCategory]: number }[]> = combineLatest([this.selectedYearDebounced$, this.backendService.overview$]).pipe(
    map(([selectedYear, overview]) => {
      if (overview[selectedYear]) {
        return overview[selectedYear];
      }
      return Array(12).fill({
        [ExpenseCategory.WOHNEN]: 0,
        [ExpenseCategory.ESSEN]: 0,
        [ExpenseCategory.GESUNDHEIT]: 0,
        [ExpenseCategory.KLEIDUNG]: 0,
        [ExpenseCategory.TRANSPORT]: 0,
        [ExpenseCategory.FREIZEIT]: 0,
        [ExpenseCategory.SONSTIGES]: 0
      })
    })
  )
  selectedYearBarHeights$: Observable<{ [category in ExpenseCategory]: number }[]> = this.selectedYearExpenses$.pipe(
    map(expenses => {
      const maxExpenseSumOfYear = Math.max(...expenses.map(monthExpenses => Object.values(monthExpenses).reduce((a, b) => a + b, 0)));
      if (maxExpenseSumOfYear === 0) {
        return expenses.map(monthExpenses => {
          return {
            [ExpenseCategory.WOHNEN]: 0,
            [ExpenseCategory.ESSEN]: 0,
            [ExpenseCategory.GESUNDHEIT]: 0,
            [ExpenseCategory.KLEIDUNG]: 0,
            [ExpenseCategory.TRANSPORT]: 0,
            [ExpenseCategory.FREIZEIT]: 0,
            [ExpenseCategory.SONSTIGES]: 0
          }
        });
      }
      return expenses.map(monthExpenses => {
        return {
          [ExpenseCategory.WOHNEN]: monthExpenses[ExpenseCategory.WOHNEN] / maxExpenseSumOfYear * this.MAX_EXPENSE_HEIGHT,
          [ExpenseCategory.ESSEN]: monthExpenses[ExpenseCategory.ESSEN] / maxExpenseSumOfYear * this.MAX_EXPENSE_HEIGHT,
          [ExpenseCategory.GESUNDHEIT]: monthExpenses[ExpenseCategory.GESUNDHEIT] / maxExpenseSumOfYear * this.MAX_EXPENSE_HEIGHT,
          [ExpenseCategory.KLEIDUNG]: monthExpenses[ExpenseCategory.KLEIDUNG] / maxExpenseSumOfYear * this.MAX_EXPENSE_HEIGHT,
          [ExpenseCategory.TRANSPORT]: monthExpenses[ExpenseCategory.TRANSPORT] / maxExpenseSumOfYear * this.MAX_EXPENSE_HEIGHT,
          [ExpenseCategory.FREIZEIT]: monthExpenses[ExpenseCategory.FREIZEIT] / maxExpenseSumOfYear * this.MAX_EXPENSE_HEIGHT,
          [ExpenseCategory.SONSTIGES]: monthExpenses[ExpenseCategory.SONSTIGES] / maxExpenseSumOfYear * this.MAX_EXPENSE_HEIGHT
        }
      });
    })
  );
  selectedMonthExpenses$ = combineLatest([this.selectedYear$, this.selectedMonth$, this.backendService.overview$]).pipe(
    map(([selectedYear, selectedMonth, overview]) => {
      if (overview[selectedYear] && overview[selectedYear][selectedMonth]) {
        const monthExpenses = {
          [ExpenseCategory.WOHNEN]: 0,
          [ExpenseCategory.ESSEN]: 0,
          [ExpenseCategory.GESUNDHEIT]: 0,
          [ExpenseCategory.KLEIDUNG]: 0,
          [ExpenseCategory.TRANSPORT]: 0,
          [ExpenseCategory.FREIZEIT]: 0,
          [ExpenseCategory.SONSTIGES]: 0
        }
        Object.entries(overview[selectedYear][selectedMonth]).forEach(([category, amount]) => {
          monthExpenses[category as ExpenseCategory] = amount;
        });
        return monthExpenses;
      } else {
        return {
          [ExpenseCategory.WOHNEN]: 0,
          [ExpenseCategory.ESSEN]: 0,
          [ExpenseCategory.GESUNDHEIT]: 0,
          [ExpenseCategory.KLEIDUNG]: 0,
          [ExpenseCategory.TRANSPORT]: 0,
          [ExpenseCategory.FREIZEIT]: 0,
          [ExpenseCategory.SONSTIGES]: 0
        }
      }
    })
  );
  selectedMonthTotalExpense$ = this.selectedMonthExpenses$.pipe(map(expenses => Object.values(expenses).reduce((a, b) => a + b, 0)));
  selectedMonthMaxExpense$ = this.selectedMonthExpenses$.pipe(map(expenses => Math.max(...Object.values(expenses))));
  expensesForSelectedMonth: { [category: string]: number } = {
    [ExpenseCategory.WOHNEN]: 0,
    [ExpenseCategory.ESSEN]: 0,
    [ExpenseCategory.GESUNDHEIT]: 0,
    [ExpenseCategory.KLEIDUNG]: 0,
    [ExpenseCategory.TRANSPORT]: 0,
    [ExpenseCategory.FREIZEIT]: 0,
    [ExpenseCategory.SONSTIGES]: 0
  }
  currentSelectedMonthMaxExpense = 0;

  handleSelectedYearChange(year: number): void {
    this.selectedYear$.next(year);
  }

  handleTransferMonthClick(): void {
    const month = this.selectedMonth$.value + 1;
    const year = this.selectedYear$.value;
    this.expenseListService.changeSelectedMonth({ year, month });
  }

  ngOnInit(): void {
    this.backendService.expensesForMonth$.subscribe(async (expensesForMonth) => {
      await lastValueFrom(this.backendService.updateOverviewForYear(this.currentYear));
    });
    this.selectedYearDebounced$.subscribe(async selectedYear => {
      await lastValueFrom(this.backendService.updateOverviewForYear(selectedYear));
    });
    this.selectedMonthExpenses$.subscribe(expenses => {
      this.expensesForSelectedMonth = expenses;
    });
    this.selectedMonthMaxExpense$.subscribe(maxExpense => {
      this.currentSelectedMonthMaxExpense = maxExpense;
    });
  }

  originalOrder = (a: any, b: any): number => 0;

}
