import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'planejamento', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'planejamento',
    loadComponent: () => import('./planejamento/form/form.component').then(m => m.FormComponent),
    canActivate: [authGuard],
  },
  {
    path: 'historico',
    loadComponent: () => import('./historico/historico.component').then(m => m.HistoricoComponent),
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'planejamento' },
];
