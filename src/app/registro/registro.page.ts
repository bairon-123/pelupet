import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DbTaskService } from '../services/db-task.service';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-registro',
  standalone: true,
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ],
})
export class RegistroPage {
  nombre: string = '';
  correo: string = '';
  contrasena: string = '';

  constructor(private db: DbTaskService, private router: Router) {}

  async registrar() {
    if (!this.nombre || !this.correo || !this.contrasena) {
      alert('⚠️ Todos los campos son obligatorios.');
      return;
    }

    if (!this.correo.includes('@') || !this.correo.includes('.')) {
      alert('⚠️ Correo no válido.');
      return;
    }

    if (this.contrasena.length < 6) {
      alert('⚠️ La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      await this.db.registrarUsuario(this.correo, this.contrasena, 'usuario', this.nombre);
      alert('✅ ¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
      this.router.navigateByUrl('/login');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      alert('❌ Error al registrar usuario.');
    }
  }
}
