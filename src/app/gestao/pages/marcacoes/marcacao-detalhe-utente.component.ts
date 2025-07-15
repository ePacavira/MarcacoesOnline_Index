import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserProfileService } from '../../../core/services/user-profile.service';

@Component({
  selector: 'app-marcacao-detalhe-utente',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="marcacao-detalhe-container" *ngIf="marcacao">
      <h2>Detalhes da Marcação</h2>
      <div><b>ID:</b> {{ marcacao.id }}</div>
      <div><b>Estado:</b> {{ getStatusText(marcacao.estado) }}</div>
      <div><b>Data Preferida:</b> {{ marcacao.dataInicioPreferida | date:'dd/MM/yyyy' }} - {{ marcacao.dataFimPreferida | date:'dd/MM/yyyy' }}</div>
      <div><b>Horário:</b> {{ marcacao.horarioPreferido }}</div>
      <div *ngIf="marcacao.observacoes"><b>Observações:</b> {{ marcacao.observacoes }}</div>
      <div *ngIf="marcacao.actosClinicos && marcacao.actosClinicos.length">
        <b>Actos Clínicos:</b>
        <ul>
          <li *ngFor="let acto of marcacao.actosClinicos">{{ acto.tipo }} - {{ acto.profissional }} ({{ acto.subsistemaSaude }})</li>
        </ul>
      </div>
      <button routerLink="/utente/minhas-marcacoes">Voltar</button>
    </div>
    <div *ngIf="loading">A carregar detalhes...</div>
    <div *ngIf="erro">Erro ao carregar detalhes da marcação.</div>
  `,
  styles: [`
    .marcacao-detalhe-container { max-width: 600px; margin: 2rem auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; padding: 2rem; }
    h2 { color: #00548d; margin-bottom: 1.5rem; }
    div { margin-bottom: 0.5rem; }
    ul { margin: 0.5rem 0 1rem 1.5rem; }
    button { background: #00548d; color: #fff; border: none; border-radius: 4px; padding: 0.5rem 1.5rem; cursor: pointer; }
    button:hover { background: #003a63; }
  `]
})
export class MarcacaoDetalheUtenteComponent implements OnInit {
  marcacao: any = null;
  loading = false;
  erro = false;

  constructor(private route: ActivatedRoute, private userProfileService: UserProfileService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loading = true;
      this.userProfileService.getUserPedido(id).subscribe({
        next: (marc: any) => {
          this.marcacao = marc;
          this.loading = false;
        },
        error: () => {
          this.erro = true;
          this.loading = false;
        }
      });
    } else {
      this.erro = true;
    }
  }

  getStatusText(estado: number): string {
    switch (estado) {
      case 0: return 'Pendente';
      case 1: return 'Agendada';
      case 2: return 'Realizada';
      case 3: return 'Cancelado';
      default: return 'Desconhecido';
    }
  }
} 