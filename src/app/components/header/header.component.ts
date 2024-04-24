import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { Observable, combineLatest, filter, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../services/utils.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  @Output() openBudgetModal: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public backendService: BackendService,
    public utilsService: UtilsService,
    private localStorageService: LocalStorageService,
    private oauthService: OAuthService
  ) { }

  displayRemainingBudget: boolean = true;
  currentMonth = new Date().getMonth();
  remainingBudget$: Observable<null | number> = this.backendService.remainingBudget$.pipe(
    filter(remainingBudget => remainingBudget !== null),
    map((remainingBudget) => {
      return remainingBudget;
    })
  );
  expensesForMonth$: Observable<null | number> = this.backendService.expensesForCurrentMonth$.pipe(
    map((expenses) => {
      if (expenses === null) {
        return null;
      }
      return expenses.reduce((acc, expense) => expense.isIncome ? acc - expense.amount : acc + expense.amount, 0);
    })
  );

  toggleDisplayRemainingBudget() {
    this.displayRemainingBudget = !this.displayRemainingBudget;
    this.localStorageService.setItem('displayRemainingBudget', this.displayRemainingBudget);
  }

  signOut() {
    this.oauthService.logOut();
  }

  ngOnInit() {
    this.displayRemainingBudget = this.localStorageService.getItem('displayRemainingBudget') ?? true;
  }

}
