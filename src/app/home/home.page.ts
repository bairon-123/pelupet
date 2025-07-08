import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DbTaskService } from '../services/db-task.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class HomePage implements OnInit {
  constructor(private router: Router, private db: DbTaskService) {}

  async ngOnInit() {
    const correo = 'bairon@gmail.com'; // 👈 cambiar si es otro correo de prueba
    await this.db.activarSesion(correo);
  }

  async cerrarSesion() {
    await this.db.cerrarSesion();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}