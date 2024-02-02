import { AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-currency-input',
  standalone: true,
  imports: [],
  templateUrl: './currency-input.component.html',
  styleUrl: './currency-input.component.scss'
})
export class CurrencyInputComponent implements OnChanges, AfterViewInit {

  @Input() value: number = 0;
  @Input() maxFontSize: number = 60;
  @Input() minFontSize: number = 20;
  @Input() maxWidthRatio: number = 0.8;
  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('input') input: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('hiddenSpan') hiddenSpan: ElementRef<HTMLSpanElement> | undefined;

  MAX_LENGTH = 15;

  ngAfterViewInit(): void {
    if (this.input && this.hiddenSpan) {
      this.input.nativeElement.style.fontSize = this.maxFontSize + "px";
      this.hiddenSpan.nativeElement.style.fontSize = this.maxFontSize + "px";
      this.hiddenSpan.nativeElement.innerHTML = "0,00";
      this.input.nativeElement.style.width = this.hiddenSpan.nativeElement.offsetWidth + "px";
      this.handleValueChange();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.handleValueChange();
    }
  }

  handleValueChange() {
    if (this.input) {
      this.updateCurrencyInput(this.input.nativeElement.value);
    }
  }

  updateCurrencyInput(text: string) {
    if (this.input && this.hiddenSpan) {
      const formattedValue = this.formatCurrencyInput(text);
      this.hiddenSpan.nativeElement.innerHTML = formattedValue;
      this.updateFontSize();
      this.input.nativeElement.style.width = this.hiddenSpan.nativeElement.offsetWidth + "px";
      this.input.nativeElement.value = (formattedValue === "0,00" ? "" : formattedValue);
    }
  }

  shrinkFontSizeUntilFit() {
    if (this.input && this.hiddenSpan) {
      let fontSize = this.hiddenSpan.nativeElement.style.fontSize;
      let hiddenSpanWidth = this.hiddenSpan.nativeElement.offsetWidth;
      const windowWidth = window.innerWidth;
      while (hiddenSpanWidth > windowWidth * this.maxWidthRatio && parseInt(fontSize) > this.minFontSize) {
        fontSize = (parseInt(fontSize) - 1) + "px";
        this.hiddenSpan.nativeElement.style.fontSize = fontSize;
        this.input.nativeElement.style.fontSize = fontSize;
        hiddenSpanWidth = this.hiddenSpan.nativeElement.offsetWidth;
      }
    }
  }

  increaseFontSizeUntilMax() {
    if (this.input && this.hiddenSpan) {
      let fontSize = this.hiddenSpan.nativeElement.style.fontSize;
      let hiddenSpanWidth = this.hiddenSpan.nativeElement.offsetWidth;
      while (hiddenSpanWidth < window.innerWidth * this.maxWidthRatio && parseInt(fontSize) < this.maxFontSize) {
        fontSize = (parseInt(fontSize) + 1) + "px";
        this.hiddenSpan.nativeElement.style.fontSize = fontSize;
        this.input.nativeElement.style.fontSize = fontSize;
        hiddenSpanWidth = this.hiddenSpan.nativeElement.offsetWidth;
      }
    }
  }

  updateFontSize() {
    if (this.input && this.hiddenSpan) {
      const windowWidth = window.innerWidth;
      const hiddenSpanWidth = this.hiddenSpan.nativeElement.offsetWidth;
      if (hiddenSpanWidth > windowWidth * this.maxWidthRatio) {
        this.shrinkFontSizeUntilFit();
      } else {
        this.increaseFontSizeUntilMax();
      }
    }
  }

  handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.updateCurrencyInput(target.value);
    this.valueChange.emit(this.currencyStringToNumber(target.value));
  }

  formatCurrencyInput(inputValue: string): string {
    inputValue = inputValue.replace(/\D/g, "");

    if (inputValue.length > this.MAX_LENGTH) {
      inputValue = inputValue.slice(0, this.MAX_LENGTH);
    }

    while (inputValue.length < 2) {
      inputValue = "0" + inputValue;
    }

    let cents = inputValue.slice(-2);
    let mainPart = parseInt(inputValue.slice(0, -2), 10);
    if (isNaN(mainPart)) {
      mainPart = 0;
    }
    let formattedValue = mainPart + "," + cents;

    for (let start = formattedValue.length - 6; start > 1; start -= 3) {
      formattedValue = formattedValue.slice(0, start) + "." + formattedValue.slice(start);
    }

    return formattedValue;
  }

  currencyStringToNumber(currencyString: string): number {
    return parseFloat(currencyString.replace(/\./g, "").replace(",", "."));
  }

}
