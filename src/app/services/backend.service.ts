import { Injectable } from '@angular/core';
import { Expense, ExpenseCategory } from '../types';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private budget: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  public budget$ = this.budget.asObservable();
  private expensesForMonth: BehaviorSubject<{ [key: string]: Expense[] }> = new BehaviorSubject({});
  public expensesForMonth$ = this.expensesForMonth.asObservable();
  public expensesForCurrentMonth$: Observable<Expense[] | null> = this.expensesForMonth$.pipe(map((expensesForMonth) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const key = `${currentYear}-${currentMonth}`;
    return expensesForMonth[key] || null;
  }));
  public remainingBudget$: Observable<number | null> = combineLatest([this.budget$, this.expensesForCurrentMonth$]).pipe(
    map(([budget, expensesForCurrentMonth]) => {
      if (budget === null || expensesForCurrentMonth === null) {
        return null;
      }
      const totalExpenses = expensesForCurrentMonth.reduce((acc, expense) => acc + expense.amount, 0);
      return budget - totalExpenses;
    })
  );

  constructor() { }

  private async fetchExpensesForMonth(year: number, month: number): Promise<Expense[]> {
    const res = await fetch(environment.API_BASE_URL + `/expenses?year=${year}&month=${month}`);
    const data = await res.json();
    return data;
  }

  public async addNewExpense(expense: { name: string, amount: number, category: ExpenseCategory, date: Date }): Promise<void> {
    if (!environment.ENABLE_FAKE_FETCH) {
      const res = await fetch(environment.API_BASE_URL + '/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(expense)
      });
      const newExpense = await res.json() as Expense;
      newExpense.date = new Date(newExpense.date);
    }
    const newExpense = { ...expense, id: Math.random().toString() };
    this.expensesForMonth.next({ ...this.expensesForMonth.getValue(), [`${expense.date.getFullYear()}-${expense.date.getMonth() + 1}`]: [...(this.expensesForMonth.getValue()[`${expense.date.getFullYear()}-${expense.date.getMonth() + 1}`] || []), newExpense] });
  }

  public async fetchBudget(): Promise<number> {
    const res = await fetch(environment.API_BASE_URL + '/budget');
    const data = await res.json();
    return data.budget;
  }

  public async deleteExpense(id: string): Promise<void> {
    if (!environment.ENABLE_FAKE_FETCH) {
      await fetch(environment.API_BASE_URL + `/expenses/${id}`, {
        method: 'DELETE'
      });
    }
    const expensesForMonth = this.expensesForMonth.getValue();
    const newExpensesForMonth: { [key: string]: Expense[] } = {};
    for (const key in expensesForMonth) {
      newExpensesForMonth[key] = expensesForMonth[key].filter(expense => expense.id !== id);
    }
    this.expensesForMonth.next(newExpensesForMonth);
  }

  public updateBudget(): void {
    if (environment.ENABLE_FAKE_FETCH) {
      this.budget.next(1000);
      return;
    }
    this.fetchBudget().then((budget) => {
      this.budget.next(budget);
    });
  }

  private deleteExpensesForMonth(year: number, month: number): void {
    const key = `${year}-${month}`;
    const expensesForMonth = this.expensesForMonth.getValue();
    const newExpensesForMonth: { [key: string]: Expense[] } = {};
    for (const k in expensesForMonth) {
      if (k !== key) {
        newExpensesForMonth[k] = expensesForMonth[k];
      }
    }
    this.expensesForMonth.next(newExpensesForMonth);
  }

  public updateExpensesForMonth(year: number, month: number): void {
    this.deleteExpensesForMonth(year, month);
    const key = `${year}-${month}`;
    if (environment.ENABLE_FAKE_FETCH) {
      this.expensesForMonth.next({
        ...this.expensesForMonth.getValue(),
        [key]: [
          {
            id: '1',
            name: 'Miete',
            amount: 600,
            category: ExpenseCategory.WOHNEN,
            date: new Date('2021-01-01')
          },
          {
            id: '2',
            name: 'Essen',
            amount: 200,
            category: ExpenseCategory.ESSEN,
            date: new Date('2021-01-02')
          }
        ]
      });
      return;
    }
    this.fetchExpensesForMonth(year, month).then((expenses) => {
      expenses = expenses.map((expense: any) => {
        return {
          id: expense.id,
          name: expense.name,
          amount: expense.amount,
          category: expense.category,
          date: new Date(expense.date)
        };
      });
      this.expensesForMonth.next({ ...this.expensesForMonth.getValue(), [key]: expenses });
    });
  }

}
