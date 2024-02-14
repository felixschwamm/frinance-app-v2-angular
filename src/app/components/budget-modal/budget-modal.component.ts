import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CurrencyInputComponent } from "../currency-input/currency-input.component";
import { BackendService } from '../../services/backend.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-budget-modal',
  standalone: true,
  templateUrl: './budget-modal.component.html',
  styleUrl: './budget-modal.component.scss',
  imports: [CurrencyInputComponent]
})
export class BudgetModalComponent implements OnInit {

  budget: null | number = null;

  @Input() openend: boolean = false;
  @Output() openendChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private backendService: BackendService,
  ) { }

  ngOnInit(): void {
    this.backendService.budget$.subscribe((budget) => {
      this.budget = budget;
    });
  }

  async submit(): Promise<void> {
    await lastValueFrom(this.backendService.setNewBudget(this.budget!));
    this.openend = false;
    this.openendChange.emit(this.openend);
  }

  onBudgetChange(budget: number): void {
    this.budget = budget;
  }

}
