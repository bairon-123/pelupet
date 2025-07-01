import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonCardHeader,
  IonCardTitle,
  IonTitle,
  IonButton,
  IonCard,
  IonCardContent
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-servicios',
  standalone: true,
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
  imports: [
  IonContent,
  IonHeader,
  IonToolbar,
  IonCardHeader,
  IonCardTitle,
  IonTitle,
  IonButton,
  IonCard,
  IonCardContent
  ]
})
export class ServiciosPage {
  constructor(private navCtrl: NavController) {}

  irHome(): void {
    this.navCtrl.navigateBack('/home');
  }
}
