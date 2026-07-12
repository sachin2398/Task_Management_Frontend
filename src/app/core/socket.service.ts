import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {

  private socket: Socket;

  constructor() {
    this.socket = io(environment.socketUrl, {
      withCredentials: true
    });

    this.socket.on('connect', () => {
      console.log('⚡ Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });
  }

  on<T = any>(event: string): Observable<T> {
    return new Observable<T>(observer => {
      this.socket.on(event, (data: T) => {
        observer.next(data);
      });

      return () => {
        this.socket.off(event);
      };
    });
  }

  emitWithAck<T = any>(event: string, data?: any): Observable<T> {
    return new Observable<T>(observer => {
      this.socket.emit(event, data, (response: any) => {
        if (response && response.success === false) {
          observer.error({ error: response });
        } else {
          observer.next(response);
          observer.complete();
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }
}
