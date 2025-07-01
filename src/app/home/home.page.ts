import { Component } from '@angular/core';
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
export class HomePage {
  constructor(private router: Router, private db: DbTaskService) {}

  async cerrarSesion() {
    await this.db.cerrarSesion();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
