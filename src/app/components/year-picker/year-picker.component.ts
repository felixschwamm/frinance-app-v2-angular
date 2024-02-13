import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { BehaviorSubject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-year-picker',
  standalone: true,
  imports: [],
  templateUrl: './year-picker.component.html',
  styleUrl: './year-picker.component.scss'
})
export class YearPickerComponent {

  constructor(
    public utilsService: UtilsService
  ) {}

  @Input() selected!: number;
  @Output() selectedChange: EventEmitter<number> = new EventEmitter<number>();

  nextYear(): void {
    this.selected = this.selected + 1;
    this.selectedChange.emit(this.selected);
  }

  previousYear(): void {
    this.selected = this.selected - 1;
    this.selectedChange.emit(this.selected);
  }

}
