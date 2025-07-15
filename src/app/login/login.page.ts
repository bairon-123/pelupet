import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DbTaskService } from '../services/db-task.service';

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
    if (!this.email || !this.password) {
      alert('⚠️ Por favor, completa todos los campos.');
      return;
    }

    const valido = await this.db.validarCredenciales(this.email, this.password);
    if (valido) {
      const usuario = await this.db.obtenerUsuarioPorCorreo(this.email);

      if (usuario) {
        localStorage.setItem('nombreUsuario', usuario.nombre ?? '');
        localStorage.setItem('correoUsuario', usuario.email ?? '');
        localStorage.setItem('rolUsuario', usuario.rol ?? 'usuario');
      }

      await this.db.activarSesion(this.email);
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } else {
      alert('❌ Credenciales incorrectas');
    }
  }
}
