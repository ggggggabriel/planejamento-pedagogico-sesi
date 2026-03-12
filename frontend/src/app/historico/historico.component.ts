import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { PlanejamentoService } from '../core/services/planejamento.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
    <div class="page-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Meus Planejamentos</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="planejamentos" style="width:100%">
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
                <a [href]="service.downloadUrl(p.id)" mat-icon-button color="primary" title="Baixar">
                  <mat-icon>download</mat-icon>
                </a>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="cols"></tr>
            <tr mat-row *matRowDef="let row; columns: cols"></tr>
          </table>
          <p *ngIf="!planejamentos.length" style="text-align:center;color:#999;padding:32px">
            Nenhum planejamento encontrado.
          </p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class HistoricoComponent implements OnInit {
  planejamentos: any[] = [];
  cols = ['disciplina', 'serie', 'bimestre', 'data', 'acoes'];

  constructor(public service: PlanejamentoService, private auth: AuthService) {}

  ngOnInit() {
    this.service.listar().subscribe(p => (this.planejamentos = p));
  }
}
