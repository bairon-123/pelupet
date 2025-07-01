import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DbTaskService } from 'src/app/services/db-task.service';

import {
  IonContent,
  IonButton,
  IonToolbar,
  IonHeader,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonTitle
} from '@ionic/angular/standalone';

import * as L from 'leaflet';

@Component({
  selector: 'app-ubicacion',
  standalone: true,
  imports: [
  IonContent,
  IonButton,
  IonToolbar,
  IonHeader,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonTitle
  ],
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.scss'],
})
export class UbicacionPage {
  constructor(private router: Router, private db: DbTaskService) {}

  async ngOnInit() {
    this.cargarMapa();
  }

  cargarMapa() {
    navigator.geolocation.getCurrentPosition((position) => {
      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      const map = L.map('mapa-ubicacion').setView([coords.lat, coords.lng], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      L.marker([coords.lat, coords.lng])
        .addTo(map)
        .bindPopup('📍 Tu ubicación actual')
        .openPopup();
    }, (error) => {
      console.error('❌ No se pudo obtener la ubicación:', error);
      alert('No se pudo obtener tu ubicación. Asegúrate de habilitar el GPS.');
    });
  }

  irHome() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }
}
