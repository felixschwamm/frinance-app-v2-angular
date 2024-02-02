import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { Observable, combineLatest, filter, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(
    public backendService: BackendService,
    public utilsService: UtilsService
  ) {}

  currentMonth = new Date().getMonth();
  remainingBudgetFormatted$: Observable<null | string> = this.backendService.remainingBudget$.pipe(
    filter(remainingBudget => remainingBudget !== null),
    map((remainingBudget) => {
      return this.utilsService.formatCurrency(remainingBudget!);
    })
  );

}
