import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, CommonModule],
  template: `
    <mat-toolbar color="primary" *ngIf="authService.isLoggedIn()">
      <span>SESI — Planejamento Pedagógico</span>
      <span style="flex:1"></span>
      <button mat-button routerLink="/planejamento">Novo Plano</button>
      <button mat-button routerLink="/historico">Histórico</button>
      <button mat-button routerLink="/dashboard" *ngIf="isCoordenador()">Dashboard</button>
      <button mat-icon-button [matMenuTriggerFor]="menu">
        <mat-icon>account_circle</mat-icon>
      </button>
      <mat-menu #menu>
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon> Sair
        </button>
      </mat-menu>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  isCoordenador(): boolean {
    const user = this.authService.getUser();
    return user?.perfil === 'COORDENADOR' || user?.perfil === 'ADMIN';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
