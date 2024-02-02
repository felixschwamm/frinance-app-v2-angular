import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-fab',
  standalone: true,
  imports: [],
  templateUrl: './fab.component.html',
  styleUrl: './fab.component.scss'
})
export class FabComponent {

  @Output() click: EventEmitter<void> = new EventEmitter<void>();

}
