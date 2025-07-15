import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { IonicModule, NavController } from '@ionic/angular'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ubicacion',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.scss'],
})
export class UbicacionPage implements AfterViewInit {

  constructor(private navCtrl: NavController) {}

  ngAfterViewInit() {
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
        .bindPopup('Tu ubicación actual')
        .openPopup();
    });
  }

  irHome(): void {
    this.navCtrl.navigateBack('/home');
  }
}


