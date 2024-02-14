import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CategorySelectComponent } from "../category-select/category-select.component";
import { CurrencyInputComponent } from "../currency-input/currency-input.component";
import { FormsModule } from '@angular/forms';
import { ExpenseCategory } from '../../types';
import { BackendService } from '../../services/backend.service';
import { ExpenseModalService } from '../../services/expense-modal.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-expense-modal',
  standalone: true,
  templateUrl: './expense-modal.component.html',
  styleUrl: './expense-modal.component.scss',
  imports: [CommonModule, CategorySelectComponent, CurrencyInputComponent, FormsModule]
})
export class ExpenseModalComponent implements OnInit {

  constructor(
    private backendService: BackendService,
    public expenseModalService: ExpenseModalService
  ) { }

  selectedPage: number = 0;

  amountInputValue: number = 0;
  nameInputValue: string = "";
  catecoryValue: ExpenseCategory = ExpenseCategory.SONSTIGES;
  mode: "add" | "edit" = "add";
  id = "";

  ngOnInit(): void {
    this.expenseModalService.modalData$.subscribe((modalData) => {
      this.amountInputValue = modalData.amount;
      this.nameInputValue = modalData.name;
      this.catecoryValue = modalData.category;
      this.id = modalData.id;
    });
    this.expenseModalService.modalMode$.subscribe((mode) => {
      this.mode = mode;
    });
  }

  close(): void {
    this.expenseModalService.toggleModal(false);
    this.expenseModalService.updateModalData(0, "", ExpenseCategory.SONSTIGES);
    this.expenseModalService.setModalMode("add");
    this.selectedPage = 0;
  }

  submit(): void {
    if (this.mode === "add") {
      this.addNewExpense();
    } else {
      this.editExpense();
    }
  }

  addNewExpense(): void {
    this.backendService.addNewExpense({
      amount: this.amountInputValue,
      category: this.catecoryValue,
      name: this.nameInputValue,
      date: new Date()
    }).subscribe(() => {
      this.close();
    });
  }

  async editExpense(): Promise<void> {
    await lastValueFrom(this.backendService.editExpense(this.id, {
      amount: this.amountInputValue,
      category: this.catecoryValue,
      name: this.nameInputValue,
      date: new Date()
    }));
    this.close();
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
