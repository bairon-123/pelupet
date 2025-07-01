import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { CommonModule } from '@angular/common';
import { DbTaskService } from 'src/app/services/db-task.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonImg,
  IonItem,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonImg,
    IonItem,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton
  ],
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  usuario = {
    nombreUsuario: '',
    correo: '',
    rol: 'usuario'
  };
  foto: string | null = null;         // Foto cargada desde BD
  fotoPreview: string | null = null;  // Foto recién tomada (temporal)
  reservas: any[] = [];

  constructor(private router: Router, private db: DbTaskService) {}

  async ionViewWillEnter(): Promise<void> {
    const nombre = localStorage.getItem('nombreUsuario');
    const correo = localStorage.getItem('correoUsuario');
    const rol = localStorage.getItem('rolUsuario');

    this.usuario.nombreUsuario = nombre ?? 'Usuario desconocido';
    this.usuario.correo = correo ?? 'Sin correo';
    this.usuario.rol = rol ?? 'usuario';

    this.foto = await this.db.obtenerFotoUsuario(this.usuario.correo);
    this.reservas = await this.db.obtenerReservasUsuario(this.usuario.correo);
  }

  async tomarFoto() {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    this.fotoPreview = image.dataUrl!;
  }

  async guardarFoto() {
    if (this.fotoPreview) {
      await this.db.guardarFotoUsuario(this.usuario.correo, this.fotoPreview);
      this.foto = this.fotoPreview; // Refleja el cambio en pantalla
      this.fotoPreview = null;
      alert('✅ Foto guardada exitosamente');
    }
  }

  irHome(): void {
    this.router.navigateByUrl('/home');
  }
}