import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PlanejamentoService } from '../../core/services/planejamento.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatListModule,
    MatCheckboxModule, MatSnackBarModule, MatProgressSpinnerModule,
  ],
  template: `
    <div class="page-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Novo Plano de Aula</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">

              <mat-form-field>
                <mat-label>Unidade</mat-label>
                <mat-select formControlName="unidade">
                  <mat-option *ngFor="let u of unidades" [value]="u">{{ u }}</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field>
                <mat-label>Professor</mat-label>
                <input matInput formControlName="professor">
              </mat-form-field>

              <mat-form-field>
                <mat-label>Série</mat-label>
                <mat-select formControlName="serie">
                  <mat-option *ngFor="let s of series" [value]="s">{{ s }}</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field>
                <mat-label>Bimestre</mat-label>
                <mat-select formControlName="bimestre">
                  <mat-option value="I">I</mat-option>
                  <mat-option value="II">II</mat-option>
                  <mat-option value="III">III</mat-option>
                  <mat-option value="IV">IV</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field>
                <mat-label>Duração da Aula</mat-label>
                <mat-select formControlName="duracaoAula">
                  <mat-option value="50 minutos">50 minutos</mat-option>
                  <mat-option value="100 minutos">100 minutos</mat-option>
                  <mat-option value="150 minutos">150 minutos</mat-option>
                  <mat-option value="200 minutos">200 minutos</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field>
                <mat-label>Capítulo</mat-label>
                <mat-select formControlName="capitulo">
                  <mat-option value="I">I</mat-option>
                  <mat-option value="II">II</mat-option>
                  <mat-option value="III">III</mat-option>
                  <mat-option value="IV">IV</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field>
                <mat-label>Período (início)</mat-label>
                <input matInput type="date" formControlName="periodo">
              </mat-form-field>

              <mat-form-field>
                <mat-label>Período (fim)</mat-label>
                <input matInput type="date" formControlName="periodoFim">
              </mat-form-field>

              <mat-form-field>
                <mat-label>Área ou Disciplina</mat-label>
                <mat-select formControlName="disciplinaId" (selectionChange)="onDisciplinaChange($event.value)">
                  <mat-option *ngFor="let d of disciplinas" [value]="d.id">{{ d.nome }}</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field>
                <mat-label>Nome do Arquivo</mat-label>
                <input matInput formControlName="nomeArquivo">
              </mat-form-field>
            </div>

            <div style="margin:16px 0" *ngIf="habilidades.length">
              <p style="font-weight:500;margin-bottom:8px">Habilidades</p>
              <div style="max-height:200px;overflow-y:auto;border:1px solid #ccc;border-radius:4px;padding:8px">
                <div *ngFor="let h of habilidades" style="display:flex;align-items:flex-start;gap:8px;margin-bottom:4px">
                  <mat-checkbox [checked]="isHabilidadeSelecionada(h.id)" (change)="toggleHabilidade(h)">
                    {{ h.descricao }}
                  </mat-checkbox>
                </div>
              </div>
            </div>

            <mat-form-field class="full-width">
              <mat-label>Desenvolvimento da Aula</mat-label>
              <textarea matInput formControlName="desenvolvimento" rows="4"></textarea>
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Estratégias e Evidências de Aprendizagem</mat-label>
              <textarea matInput formControlName="estrategia" rows="4"></textarea>
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Observações</mat-label>
              <textarea matInput formControlName="observacoes" rows="3"></textarea>
            </mat-form-field>

            <div style="display:flex;gap:16px;justify-content:flex-end;margin-top:16px">
              <button mat-button type="button" routerLink="/historico">Ver Histórico</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="loading || form.invalid">
                <mat-spinner *ngIf="loading" diameter="20" style="display:inline-block"></mat-spinner>
                {{ loading ? 'Salvando...' : 'Salvar e Baixar' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class FormComponent implements OnInit {
  form: FormGroup;
  disciplinas: { id: number; nome: string }[] = [];
  habilidades: { id: number; descricao: string }[] = [];
  habilidadesSelecionadas: { id: number; descricao: string }[] = [];
  loading = false;

  unidades = [
    'SESI Araripina', 'SESI Belo Jardim', 'SESI Cabo', 'SESI Camaragibe',
    'SESI Caruaru', 'SESI Garanhuns', 'SESI Petrolina', 'SESI Recife',
  ];

  series = [
    '1° Ensc Fund anos iniciais', '2° Ensc Fund anos iniciais',
    '3° Ensc Fund anos iniciais', '4° Ensc Fund anos iniciais',
    '5° Ensc Fund anos iniciais', '6° Ensc Fund anos finais',
    '7° Ensc Fund anos finais', '8° Ensc Fund anos finais',
    '9° Ensc Fund anos finais', '1° Ensc médio', '2° Ensc médio',
    '3° Ensc médio', 'EJA',
  ];

  constructor(
    private fb: FormBuilder,
    private service: PlanejamentoService,
    private snack: MatSnackBar,
    private router: Router,
  ) {
    this.form = this.fb.group({
      unidade: ['', Validators.required],
      professor: ['', Validators.required],
      serie: ['', Validators.required],
      bimestre: ['', Validators.required],
      duracaoAula: ['', Validators.required],
      capitulo: ['', Validators.required],
      periodo: ['', Validators.required],
      periodoFim: ['', Validators.required],
      disciplinaId: ['', Validators.required],
      nomeArquivo: ['', Validators.required],
      desenvolvimento: ['', Validators.required],
      estrategia: [''],
      observacoes: [''],
    });
  }

  ngOnInit() {
    this.service.getDisciplinas().subscribe(d => {
      this.disciplinas = d;
      if (d.length) this.onDisciplinaChange(d[0].id);
    });
  }

  onDisciplinaChange(id: number) {
    this.form.patchValue({ disciplinaId: id });
    this.habilidadesSelecionadas = [];
    this.service.getHabilidades(id).subscribe(h => (this.habilidades = h));
  }

  isHabilidadeSelecionada(id: number): boolean {
    return this.habilidadesSelecionadas.some(h => h.id === id);
  }

  toggleHabilidade(h: { id: number; descricao: string }) {
    const idx = this.habilidadesSelecionadas.findIndex(x => x.id === h.id);
    if (idx >= 0) this.habilidadesSelecionadas.splice(idx, 1);
    else this.habilidadesSelecionadas.push(h);
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    const payload = {
      ...this.form.value,
      habilidades: this.habilidadesSelecionadas.map(h => h.descricao).join('\n'),
    };
    this.service.criar(payload).subscribe({
      next: (p) => {
        this.snack.open('Planejamento salvo!', 'OK', { duration: 3000 });
        window.open(this.service.downloadUrl(p.id), '_blank');
        this.loading = false;
        this.router.navigate(['/historico']);
      },
      error: (err) => {
        this.snack.open(err.error?.error || 'Erro ao salvar', 'OK', { duration: 4000 });
        this.loading = false;
      },
    });
  }
}
