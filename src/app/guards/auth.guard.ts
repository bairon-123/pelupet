import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DbTaskService } from '../services/db-task.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private db: DbTaskService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const activo = await this.db.haySesionActiva();
    if (!activo) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
