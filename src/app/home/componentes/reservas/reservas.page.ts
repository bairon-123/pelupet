import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DbTaskService } from 'src/app/services/db-task.service';
import { NavController } from '@ionic/angular';
import { OnInit } from '@angular/core';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonDatetime
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-reservas',
  standalone: true,
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
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
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonDatetime
  ]
})
export class ReservasPage implements OnInit { // 👈 Implementar OnInit
  nombrePerro = '';
  raza = '';
  tamano = 'Pequeño';
  tipoServicio = 'Express';
  peso: number | null = null;
  indicaciones = '';
  fechaHora = '';
  minDate: string = new Date().toISOString();
  usuarioEmail: string = '';

  constructor(private db: DbTaskService, private navCtrl: NavController) {}

   async ngOnInit() {
    const correo = 'bairon@gmail.com'; // 👈 cambiar si es otro correo de prueba
    await this.db.activarSesion(correo);
  }

  async guardarReserva(): Promise<void> {
    if (!this.nombrePerro || !this.raza || !this.tamano || !this.tipoServicio || !this.peso || !this.fechaHora) {
      alert('⚠️ Por favor completa todos los campos correctamente.');
      return;
    }

    const datos = {
      nombrePerro: this.nombrePerro,
      raza: this.raza,
      tamano: this.tamano,
      tipoServicio: this.tipoServicio,
      peso: this.peso,
      indicaciones: this.indicaciones,
      fechaHora: this.fechaHora
    };

    try {
      await this.db.guardarReservaCompleta(this.usuarioEmail, datos);
      await this.db.activarSesion(this.usuarioEmail); // Opcional
      alert('✅ ¡Reserva guardada con éxito!');
      this.navCtrl.navigateRoot('/home');
    } catch (error) {
      console.error('❌ Error al guardar la reserva:', error);
      alert('Ocurrió un error al guardar la reserva.');
    }
  }

  irHome(): void {
    this.navCtrl.navigateBack('/home');
  }
}

