import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-month-select',
  standalone: true,
  imports: [],
  templateUrl: './month-select.component.html',
  styleUrl: './month-select.component.scss'
})
export class MonthSelectComponent {

  constructor(
    public utilsService: UtilsService
  ) {}

  @Input() selected!: { year: number, month: number };
  @Output() selectedChange: EventEmitter<{ year: number, month: number }> = new EventEmitter<{ year: number, month: number }>();

  nextMonth(): void {
    if (this.selected.month === 12) {
      this.selected = { year: this.selected.year + 1, month: 1 };
    } else {
      this.selected = { year: this.selected.year, month: this.selected.month + 1 };
    }
    this.selectedChange.emit(this.selected);
  }

  previousMonth(): void {
    if (this.selected.month === 1) {
      this.selected = { year: this.selected.year - 1, month: 12 };
    } else {
      this.selected = { year: this.selected.year, month: this.selected.month - 1 };
    }
    this.selectedChange.emit(this.selected);
  }

}
