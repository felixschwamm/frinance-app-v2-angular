import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { Observable, combineLatest, filter, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../services/utils.service';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  @Output() openBudgetModal: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public backendService: BackendService,
    public utilsService: UtilsService,
    private oauthService: OAuthService
  ) {}

  currentMonth = new Date().getMonth();
  remainingBudgetFormatted$: Observable<null | string> = this.backendService.remainingBudget$.pipe(
    filter(remainingBudget => remainingBudget !== null),
    map((remainingBudget) => {
      return this.utilsService.formatCurrency(remainingBudget!);
    })
  );

  signOut() {
    this.oauthService.logOut();
  }

}
