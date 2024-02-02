import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { ExpenseCategory } from '../../types';

@Component({
  selector: 'app-category-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-select.component.html',
  styleUrl: './category-select.component.scss'
})
export class CategorySelectComponent {

  constructor(
    public utilsService: UtilsService
  ) {}

  @Input() selected: ExpenseCategory = ExpenseCategory.SONSTIGES;
  @Output() selectedChange: EventEmitter<ExpenseCategory> = new EventEmitter<ExpenseCategory>();

  categories = Object.keys(ExpenseCategory);

  changeSelected(selected: string): void {
    this.selected = selected as ExpenseCategory;
    this.selectedChange.emit(this.selected);
  }

}
