import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { combineLatest, filter, map } from 'rxjs';
import { ExpenseCategory } from '../../types';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-expense-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expense-bar.component.html',
  styleUrl: './expense-bar.component.scss'
})
export class ExpenseBarComponent implements OnInit {

  constructor(
    private backendService: BackendService,
    public utilsService: UtilsService
  ) { }

  private widthsPerCategory$ = combineLatest([this.backendService.expensesForCurrentMonth$, this.backendService.budget$]).pipe(
    filter(([expensesForCurrentMonth, budget]) => expensesForCurrentMonth !== null),
    map(([expensesForCurrentMonth, budget]) => {
      console.log(Object.keys(ExpenseCategory))
      if (budget === null || expensesForCurrentMonth === null) {
        return Object.keys(ExpenseCategory).filter(key => isNaN(Number(key))).reduce((acc, category) => {
          return {
            ...acc,
            [category]: 0
          };
        }, {});
      }

      const expenses = Object.values(expensesForCurrentMonth).flat();
      const totalAmount = expenses.reduce((acc, expense) => acc + expense.amount, 0);

      return Object.keys(ExpenseCategory).filter(key => isNaN(Number(key))).reduce((acc, category) => {
        console.log('category', category);
        const categoryExpenses = expenses.filter(expense => expense.category === category);
        const categoryAmount = categoryExpenses.reduce((acc, expense) => acc + expense.amount, 0);
        const categoryWidth = totalAmount > budget ? (categoryAmount / totalAmount) * 100 : (categoryAmount / budget) * 100;
        return {
          ...acc,
          [category]: categoryWidth
        };
      }, {});

    })
  );

  public widthsPerCategoryKeyValues$ = this.widthsPerCategory$.pipe(
    map(widthsPerCategory => Object.entries(widthsPerCategory))
  );

  ngOnInit(): void {

  }

}
