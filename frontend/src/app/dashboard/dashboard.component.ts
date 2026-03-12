import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { PlanejamentoService } from '../core/services/planejamento.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
    <div class="page-container">
      <h2>Dashboard — Coordenação</h2>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px">
        <mat-card>
          <mat-card-content style="text-align:center">
            <div style="font-size:48px;font-weight:300;color:#1565C0">{{ planejamentos.length }}</div>
            <div>Total de Planejamentos</div>
          </mat-card-content>
        </mat-card>
        <mat-card>
          <mat-card-content style="text-align:center">
            <div style="font-size:48px;font-weight:300;color:#1565C0">{{ professores.size }}</div>
            <div>Professores Ativos</div>
          </mat-card-content>
        </mat-card>
        <mat-card>
          <mat-card-content style="text-align:center">
            <div style="font-size:48px;font-weight:300;color:#1565C0">{{ disciplinasUnicas.size }}</div>
            <div>Disciplinas Cobertas</div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card>
        <mat-card-header><mat-card-title>Todos os Planejamentos</mat-card-title></mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="planejamentos" style="width:100%">
            <ng-container matColumnDef="professor">
              <th mat-header-cell *matHeaderCellDef>Professor</th>
              <td mat-cell *matCellDef="let p">{{ p.usuario?.nome }}</td>
            </ng-container>
            <ng-container matColumnDef="disciplina">
              <th mat-header-cell *matHeaderCellDef>Disciplina</th>
              <td mat-cell *matCellDef="let p">{{ p.disciplina?.nome }}</td>
            </ng-container>
            <ng-container matColumnDef="serie">
              <th mat-header-cell *matHeaderCellDef>Série</th>
              <td mat-cell *matCellDef="let p">{{ p.serie }}</td>
            </ng-container>
            <ng-container matColumnDef="bimestre">
              <th mat-header-cell *matHeaderCellDef>Bimestre</th>
              <td mat-cell *matCellDef="let p">{{ p.bimestre }}</td>
            </ng-container>
            <ng-container matColumnDef="data">
              <th mat-header-cell *matHeaderCellDef>Data</th>
              <td mat-cell *matCellDef="let p">{{ p.createdAt | date:'dd/MM/yyyy' }}</td>
            </ng-container>
            <ng-container matColumnDef="acoes">
              <th mat-header-cell *matHeaderCellDef>Ações</th>
              <td mat-cell *matCellDef="let p">
                <a [href]="service.downloadUrl(p.id)" mat-icon-button color="primary">
                  <mat-icon>download</mat-icon>
                </a>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="cols"></tr>
            <tr mat-row *matRowDef="let row; columns: cols"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  planejamentos: any[] = [];
  cols = ['professor', 'disciplina', 'serie', 'bimestre', 'data', 'acoes'];
  professores = new Set<string>();
  disciplinasUnicas = new Set<string>();

  constructor(public service: PlanejamentoService) {}

  ngOnInit() {
    this.service.listar().subscribe(p => {
      this.planejamentos = p;
      p.forEach((x: any) => {
        if (x.usuario?.email) this.professores.add(x.usuario.email);
        if (x.disciplina?.nome) this.disciplinasUnicas.add(x.disciplina.nome);
      });
    });
  }
}
