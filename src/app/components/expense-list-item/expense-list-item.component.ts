import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { Expense } from '../../types';
import { UtilsService } from '../../services/utils.service';
import { CommonModule } from '@angular/common';
import { BackendService } from '../../services/backend.service';
import { lastValueFrom } from 'rxjs';
import { ExpenseModalService } from '../../services/expense-modal.service';

@Component({
  selector: 'app-expense-list-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expense-list-item.component.html',
  styleUrl: './expense-list-item.component.scss'
})
export class ExpenseListItemComponent implements AfterViewInit {

  constructor(
    public utilsService: UtilsService,
    public backendService: BackendService,
    private expenseModalService: ExpenseModalService
  ) { }

  @ViewChild('myElement') myElement!: ElementRef<HTMLDivElement>;
  @ViewChild('deleteDiv') deleteDiv!: ElementRef<HTMLDivElement>;
  @ViewChild('editDiv') editDiv!: ElementRef<HTMLDivElement>;
  @ViewChild('deleteIcon') deleteIcon!: ElementRef<HTMLDivElement>;
  @ViewChild('editIcon') editIcon!: ElementRef<HTMLDivElement>;

  isAnimatingBack = false;
  deleteActive = false;
  editActive = false;
  resetPositionTimeout: any;

  setResetPositionTimeout(): void {
    clearTimeout(this.resetPositionTimeout);
    this.resetPositionTimeout = setTimeout(() => {
      if (this.transformX > 50) {
        return;
      }
      this.isAnimatingBack = false;
      this.myElement.nativeElement.style.transition = "";
      this.deleteDiv.nativeElement.style.transition = "";
      this.editDiv.nativeElement.style.transition = "";
      this.deleteIcon.nativeElement.style.transition = "";
      this.editIcon.nativeElement.style.transition = "";
      this.transformX = 0;
      this.deleteActive = false;
      this.editActive = false;
      this.deleteIcon.nativeElement.style.opacity = "0";
      this.editIcon.nativeElement.style.opacity = "0";
    }, 500);
  }

  ngAfterViewInit(): void {
    import('hammerjs').then(({ default: Hammer }) => {
      const hammer = new Hammer(this.myElement.nativeElement);

      let posX = 0,
        lastPosX = 0,
        velocityX = 0;

      hammer.on("panstart", (ev) => {
        // If an animation is in progress, reset the element
        if (this.isAnimatingBack) {
          this.myElement.nativeElement.style.transition = "";
          this.deleteDiv.nativeElement.style.transition = "";
          this.editDiv.nativeElement.style.transition = "";
          this.deleteIcon.nativeElement.style.transition = "";
          this.editIcon.nativeElement.style.transition = "";
          this.transformX = 0;
          posX = 0;
          lastPosX = 0;
          this.isAnimatingBack = false;
        }
        this.setResetPositionTimeout();
      });

      hammer.on("panmove", (ev) => {
        // Calculate position and apply transformation
        posX = lastPosX + ev.deltaX;
        velocityX = ev.velocityX;
        this.transformX = posX;

        if (posX > 40) {
          this.deleteIcon.nativeElement.style.opacity = "1";
        } else {
          this.deleteIcon.nativeElement.style.opacity = "0";
        }

        if (posX < -40) {
          this.editIcon.nativeElement.style.opacity = "1";
        } else {
          this.editIcon.nativeElement.style.opacity = "0";
        }

        // if it is dragged 25% of the width, activate the delete button
        if (posX > this.myElement.nativeElement.offsetWidth * 0.4) {
          this.deleteActive = true;
          this.deleteIcon.nativeElement.style.fontSize = "24px";
        } else {
          this.deleteActive = false;
          this.deleteIcon.nativeElement.style.fontSize = "16px";
        }

        // if it is dragged 25% of the width, activate the edit button
        if (posX < -this.myElement.nativeElement.offsetWidth * 0.4) {
          this.editActive = true;
          this.editIcon.nativeElement.style.fontSize = "24px";
        } else {
          this.editActive = false;
          this.editIcon.nativeElement.style.fontSize = "16px";
        }

        this.setResetPositionTimeout();
      });

      hammer.on("panend", async () => {
        // Apply momentum based on velocity
        posX += velocityX * 50; // adjust multiplier for desired momentum
        this.transformX = posX;

        if (this.editActive) {
          await this.editExpense();
        }

        if (this.deleteActive) {
          this.myElement.nativeElement.style.transition = "transform 0.3s ease-out";
          this.deleteDiv.nativeElement.style.transition = "transform 0.3s ease-out";
          this.editDiv.nativeElement.style.transition = "transform 0.3s ease-out";
          this.deleteIcon.nativeElement.style.transition = "transform 0.3s ease-out";
          this.editIcon.nativeElement.style.transition = "transform 0.3s ease-out";
          
          this.transformX = this.myElement.nativeElement.offsetWidth + 6;
          await this.deleteExpense();
        }

        if (!this.deleteActive) {
          this.deleteIcon.nativeElement.style.opacity = "0";
          this.editIcon.nativeElement.style.opacity = "0";
        }

        // Animate back to original position with ease-out
        setTimeout(() => {
          this.isAnimatingBack = true;
          this.myElement.nativeElement.style.transition = "transform 0.3s ease-out";
          this.deleteDiv.nativeElement.style.transition = "transform 0.3s ease-out";
          this.editDiv.nativeElement.style.transition = "transform 0.3s ease-out";
          this.deleteIcon.nativeElement.style.transition = "transform 0.3s ease-out";
          this.editIcon.nativeElement.style.transition = "transform 0.3s ease-out";
          this.transformX = 0;
          lastPosX = 0;
          // editActive = false;
          // deleteActive = false;
        }, 100); // adjust timeout for desired momentum duration

        // Reset transition after animation
        this.myElement.nativeElement.addEventListener("transitionend", () => {
          this.myElement.nativeElement.style.transition = "";
          this.deleteDiv.nativeElement.style.transition = "";
          this.editDiv.nativeElement.style.transition = "";
          this.deleteIcon.nativeElement.style.transition = "";
          this.editIcon.nativeElement.style.transition = "";
          this.isAnimatingBack = false;
        });
      });
    });
  }

  @Input() expense!: Expense;

  transformX = 0;

  async editExpense(): Promise<void> {
    this.expenseModalService.toggleModal(true);
    this.expenseModalService.updateModalData(this.expense.amount, this.expense.name, this.expense.category, this.expense.id);
    this.expenseModalService.setModalMode('edit');
  }

  async deleteExpense(): Promise<void> {
    return lastValueFrom(this.backendService.deleteExpense(this.expense.id));
  }

}
