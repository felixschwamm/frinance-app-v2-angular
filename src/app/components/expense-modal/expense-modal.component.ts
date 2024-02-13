import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CategorySelectComponent } from "../category-select/category-select.component";
import { CurrencyInputComponent } from "../currency-input/currency-input.component";
import { FormsModule } from '@angular/forms';
import { ExpenseCategory } from '../../types';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-expense-modal',
  standalone: true,
  templateUrl: './expense-modal.component.html',
  styleUrl: './expense-modal.component.scss',
  imports: [CommonModule, CategorySelectComponent, CurrencyInputComponent, FormsModule]
})
export class ExpenseModalComponent {

  @Input() opened: boolean = false;
  @Output() openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private backendService: BackendService
  ) { }

  selectedPage: number = 0;

  amountInputValue: number = 0;
  nameInputValue: string = "";
  catecoryValue: ExpenseCategory = ExpenseCategory.SONSTIGES;

  close(): void {
    this.opened = false;
    this.openedChange.emit(this.opened);
  }

  submit(): void {
    this.backendService.addNewExpense({
      amount: this.amountInputValue,
      category: this.catecoryValue,
      name: this.nameInputValue,
      date: new Date()
    }).subscribe(() => {
      this.opened = false;
      this.amountInputValue = 0;
      this.nameInputValue = "";
      this.catecoryValue = ExpenseCategory.SONSTIGES;
      this.openedChange.emit(this.opened);
    });
  }

  handleNameInput(event: Event): void {
    // only allow a-z, A-Z, 0-9, space, and hyphen
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-zA-Z0-9\s-]/g, "");

    // limit length to 50
    if (input.value.length > 40) {
      input.value = input.value.substring(0, 50);
    }

  }

}
