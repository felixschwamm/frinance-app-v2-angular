import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExpenseListComponent } from "./components/expense-list/expense-list.component";
import { Expense, ExpenseCategory } from './types';
import { BackendService } from './services/backend.service';
import { HeaderComponent } from "./components/header/header.component";
import { ExpenseBarComponent } from "./components/expense-bar/expense-bar.component";
import { FabComponent } from "./components/fab/fab.component";
import { ExpenseModalComponent } from "./components/expense-modal/expense-modal.component";
import { OverviewComponent } from "./components/overview/overview.component";
import { AuthService } from './services/auth.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { ExpenseModalService } from './services/expense-modal.service';
import { BudgetModalComponent } from "./components/budget-modal/budget-modal.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [
        RouterOutlet,
        ExpenseListComponent,
        HeaderComponent,
        ExpenseBarComponent,
        FabComponent,
        ExpenseModalComponent,
        OverviewComponent,
        BudgetModalComponent
    ]
})
export class AppComponent implements OnInit {

  constructor(
    private backendService: BackendService,
    private oauthService: OAuthService,
    public expenseModalService: ExpenseModalService,
  ) { }

  public expenseModalOpened = false;
  public budgetModalOpened = false;

  ngOnInit(): void {

    if (this.oauthService.hasValidAccessToken()) {
      // If we have a valid access token, we are logged in
    } else {
      // If not logged in, initiate the login flow
      this.oauthService.initLoginFlow();
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    this.backendService.updateExpensesForMonth(currentYear, currentMonth);
    this.backendService.updateBudget();
    this.backendService.updateOverviewForYear(currentYear);
  }
}
