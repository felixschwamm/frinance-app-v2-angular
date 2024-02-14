import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ExpenseCategory } from '../types';

@Injectable({
  providedIn: 'root'
})
export class ExpenseModalService {

  constructor() { }

  private modalOpened: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public modalOpened$ = this.modalOpened.asObservable();

  private modalMode: BehaviorSubject<'add' | 'edit'> = new BehaviorSubject<'add' | 'edit'>('add');
  public modalMode$ = this.modalMode.asObservable();

  private modalData: BehaviorSubject<{amount: number, name: string, category: ExpenseCategory, id: string}> = new BehaviorSubject<{amount: number, name: string, category: ExpenseCategory, id: string}>({amount: 0, name: "", category: ExpenseCategory.SONSTIGES, id: ""});
  public modalData$ = this.modalData.asObservable();

  public updateModalData(amount: number, name: string, category: ExpenseCategory, id = ""): void {
    this.modalData.next({amount, name, category, id});
  }

  public toggleModal(opened: boolean): void {
    this.modalOpened.next(opened);
  }

  public setModalMode(mode: 'add' | 'edit'): void {
    this.modalMode.next(mode);
  }

}
