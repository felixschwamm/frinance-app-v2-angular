import { Component, Input } from '@angular/core';
import { Expense } from '../../types';
import { UtilsService } from '../../services/utils.service';
import { CommonModule } from '@angular/common';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-expense-list-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expense-list-item.component.html',
  styleUrl: './expense-list-item.component.scss'
})
export class ExpenseListItemComponent {

  constructor(
    public utilsService: UtilsService,
    public backendService: BackendService
  ) {}

  @Input() expense!: Expense;

  menuOpenend = false;

  deleteExpense(): void {
    this.backendService.deleteExpense(this.expense.id);
  }

}
