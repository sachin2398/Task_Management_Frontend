import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/toast/toast.component';
import { ConfirmComponent } from './components/confirm/confirm.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, ConfirmComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}