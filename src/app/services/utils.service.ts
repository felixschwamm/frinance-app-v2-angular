import { Injectable } from '@angular/core';
import { ExpenseCategory } from '../types';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public getReadableDate(date: Date): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffTime = today.getTime() - inputDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    if (diffDays < 1) {
      // If the date is today, return the time in "hh-mm" format
      return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
    } else if (diffDays === 1) {
      // If the date was yesterday, return "gestern"
      return "gestern";
    } else {
      // Define month names
      const monthNames = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

      // Format for dates from the current year
      if (date.getFullYear() === now.getFullYear()) {
        if (diffDays > 1 && diffDays <= 7) {
          // If the date was between 2 and 7 days ago
          return `vor ${Math.floor(diffDays)} Tagen`;
        } else {
          // If the date is older than 7 days but from the current year
          return `${inputDate.getDate().toString().padStart(2, '0')}. ${monthNames[inputDate.getMonth()]}`;
        }
      } else {
        // If the date is from a different year
        return `${inputDate.getDate().toString().padStart(2, '0')}. ${monthNames[inputDate.getMonth()]} ${inputDate.getFullYear()}`;
      }
    }
  }

  public formatCurrency(amount: number): string {
    return amount.toFixed(2).replace('.', ',');
  }

  public getCategoryColor(category: string) {
    switch (category) {
      case ExpenseCategory.WOHNEN:
        return 'B30000'
      case ExpenseCategory.ESSEN:
        return '7C1158'
      case ExpenseCategory.GESUNDHEIT:
        return '4421AF'
      case ExpenseCategory.KLEIDUNG:
        return '1A53FF'
      case ExpenseCategory.TRANSPORT:
        return '00B7C7'
      case ExpenseCategory.FREIZEIT:
        return '5AD45A'
      case ExpenseCategory.SONSTIGES:
        return 'A6A6A6'
      default:
        return '000000'
    }
  }

  public getMonthName(month: number, short: boolean = false): string {
    const monthNames = short
      ? ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
      : ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    return monthNames[month];
  }

}
