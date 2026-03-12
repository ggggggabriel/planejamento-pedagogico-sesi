import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatProgressSpinnerModule, MatIconModule],
  template: `
    <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:#1565C0">
      <mat-card style="width:400px;padding:32px">
        <mat-card-header style="justify-content:center;margin-bottom:24px">
          <mat-card-title style="font-size:24px">SESI Planejamento</mat-card-title>
          <mat-card-subtitle>Acesse sua conta</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field class="full-width">
              <mat-label>E-mail</mat-label>
              <input matInput formControlName="email" type="email" placeholder="seu@email.com">
              <mat-error *ngIf="form.get('email')?.invalid">E-mail inválido</mat-error>
            </mat-form-field>
            <mat-form-field class="full-width">
              <mat-label>Senha</mat-label>
              <input matInput formControlName="senha" [type]="showSenha ? 'text' : 'password'">
              <button mat-icon-button matSuffix type="button" (click)="showSenha = !showSenha">
                <mat-icon>{{ showSenha ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>
            <p *ngIf="erro" style="color:red;font-size:14px">{{ erro }}</p>
            <button mat-raised-button color="primary" class="full-width" type="submit" [disabled]="loading">
              <mat-spinner *ngIf="loading" diameter="20" style="display:inline-block;margin-right:8px"></mat-spinner>
              {{ loading ? 'Entrando...' : 'Entrar' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  erro = '';
  showSenha = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.erro = '';
    const { email, senha } = this.form.value;
    this.auth.login(email, senha).subscribe({
      next: () => this.router.navigate(['/planejamento']),
      error: (err) => {
        this.erro = err.error?.error || 'Erro ao fazer login';
        this.loading = false;
      },
    });
  }
}
