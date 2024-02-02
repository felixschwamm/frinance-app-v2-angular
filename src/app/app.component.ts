import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExpenseListComponent } from "./components/expense-list/expense-list.component";
import { Expense, ExpenseCategory } from './types';
import { BackendService } from './services/backend.service';
import { HeaderComponent } from "./components/header/header.component";
import { ExpenseBarComponent } from "./components/expense-bar/expense-bar.component";
import { FabComponent } from "./components/fab/fab.component";
import { ExpenseModalComponent } from "./components/expense-modal/expense-modal.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, ExpenseListComponent, HeaderComponent, ExpenseBarComponent, FabComponent, ExpenseModalComponent]
})
export class AppComponent implements OnInit {

  constructor(
    private backendService: BackendService
  ) {}

  public expenseModalOpened = false;

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    this.backendService.updateExpensesForMonth(currentYear, currentMonth);
    this.backendService.updateBudget();
  }

  testExpenses: Expense[] = [
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
  ];
}
