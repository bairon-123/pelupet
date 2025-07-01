import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DbTaskService } from '../services/db-task.service'; // Asegúrate de que esta ruta es correcta

// Ionic UI Components
import {
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCardContent
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonCardContent
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private db: DbTaskService) {}

  async ngOnInit() {
    const sesionActiva = await this.db.haySesionActiva();
    if (sesionActiva) {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    }
  }

  async login() {
    const correoValido = 'bairon@gmail.com';
    const claveValida = '123456';

    if (this.email === correoValido && this.password === claveValida) {
      await this.db.activarSesion(this.email);
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } else {
      alert('❌ Credenciales incorrectas');
    }
  }
}
