import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  isOpen = signal(false);
  message = signal('');
  
  private responseSubject = new Subject<boolean>();

  confirm(message: string): Promise<boolean> {
    this.message.set(message);
    this.isOpen.set(true);
    
    this.responseSubject = new Subject<boolean>();
    return new Promise((resolve) => {
      this.responseSubject.subscribe(res => {
        this.isOpen.set(false);
        resolve(res);
      });
    });
  }

  onConfirm() {
    this.responseSubject.next(true);
  }

  onCancel() {
    this.responseSubject.next(false);
  }
}
