import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss'
})
export class SelectComponent {

  @Input() items!: string[];
  @Input() selected: number = 0;
  @Output() selectedChange: EventEmitter<number> = new EventEmitter<number>();

  change(selected: number): void {
    this.selected = selected;
    this.selectedChange.emit(selected);
  }

}
