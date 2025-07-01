import { Routes } from '@angular/router';
import { LoginPage } from './login/login.page';
import { HomePage } from './home/home.page';
import { PerfilPage } from './home/componentes/perfil/perfil.page';
import { ReservasPage } from './home/componentes/reservas/reservas.page';
import { ServiciosPage } from './home/componentes/servicios/servicios.page';
import { UbicacionPage } from './home/componentes/ubicacion/ubicacion.component';



export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'home', component: HomePage },
  { path: 'perfil', component: PerfilPage },
  { path: 'reservas', component: ReservasPage },
  { path: 'servicios', component: ServiciosPage },
  { path: 'ubicacion', component: UbicacionPage },
  
];

