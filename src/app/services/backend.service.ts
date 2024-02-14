import { Injectable } from '@angular/core';
import { Expense, ExpenseCategory } from '../types';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, combineLatest, map, subscribeOn } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
  private overview: BehaviorSubject<{ [year: number]: { [category: string]: number }[] }> = new BehaviorSubject({});
  public overview$ = this.overview.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  private fetchOverviewForYear(year: number): Observable<{ [category: string]: number }[]> {
    return this.http.get(environment.API_BASE_URL + `/overview?year=${year}`) as Observable<{ [category: string]: number }[]>;
  }

  private fetchExpensesForMonth(year: number, month: number): Observable<Expense[]> {
    return this.http.get(environment.API_BASE_URL + `/expenses?year=${year}&month=${month}`) as Observable<Expense[]>;
  }

  public updateOverviewForYear(year: number): Observable<void> {
    return new Observable(subscriber => {
      const overview = this.overview.getValue();
      delete overview[year];
      this.overview.next(overview);
      this.fetchOverviewForYear(year).subscribe((overviewForYear) => {
        this.overview.next({ ...this.overview.getValue(), [year]: overviewForYear });
      });
      subscriber.next();
      subscriber.complete();
    });
  }

  public addNewExpense(expense: { name: string, amount: number, category: ExpenseCategory, date: Date }): Observable<void> {
    return new Observable(subscriber => {
      this.http.post(environment.API_BASE_URL + '/expenses', expense).subscribe((body: any) => {
        const newExpense = { ...expense, id: body.id };
        this.expensesForMonth.next({ ...this.expensesForMonth.getValue(), [`${expense.date.getFullYear()}-${expense.date.getMonth() + 1}`]: [...(this.expensesForMonth.getValue()[`${expense.date.getFullYear()}-${expense.date.getMonth() + 1}`] || []), newExpense] });
        subscriber.next();
        subscriber.complete();
      });
    });
  }

  private editExpenseLocal(id: string, expense: { name: string, amount: number, category: ExpenseCategory, date: Date }): void {
    const expensesForMonth = this.expensesForMonth.getValue();
    const newExpensesForMonth: { [key: string]: Expense[] } = {};
    for (const key in expensesForMonth) {
      newExpensesForMonth[key] = expensesForMonth[key].map(exp => exp.id === id ? { ...exp, ...expense } : exp);
    }
    this.expensesForMonth.next(newExpensesForMonth);
  }

  public editExpense(id: string, expense: { name: string, amount: number, category: ExpenseCategory, date: Date }): Observable<void> {
    return new Observable(subscriber => {
      this.http.put(environment.API_BASE_URL + `/expenses/${id}`, expense).subscribe(() => {
        this.editExpenseLocal(id, expense);
        subscriber.next();
        subscriber.complete();
      });
    });
  }

  public setNewBudget(newBudget: number): Observable<void> {
    return new Observable(subscriber => {
      this.http.put(environment.API_BASE_URL + '/budget', { budget: newBudget }).subscribe(() => {
        this.budget.next(newBudget);
        subscriber.next();
        subscriber.complete();
      });
    });
  }

  public fetchBudget(): Observable<number> {
    return this.http.get(environment.API_BASE_URL + '/budget').pipe(
      map((body: any) => body.budget)
    ) as Observable<number>;
  }

  public deleteExpense(id: string): Observable<void> {
    return new Observable(subscriber => {
      this.http.delete(environment.API_BASE_URL + `/expenses/${id}`).subscribe(() => {
        const expensesForMonth = this.expensesForMonth.getValue();
        const newExpensesForMonth: { [key: string]: Expense[] } = {};
        for (const key in expensesForMonth) {
          newExpensesForMonth[key] = expensesForMonth[key].filter(expense => expense.id !== id);
        }
        this.expensesForMonth.next(newExpensesForMonth);
        subscriber.next();
        subscriber.complete();
      });
    });
  }

  public updateBudget(): void {
    this.fetchBudget().subscribe((budget) => {
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
    this.fetchExpensesForMonth(year, month).subscribe((expenses) => {
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
