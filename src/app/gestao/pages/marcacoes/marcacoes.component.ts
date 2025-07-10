import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterOption, PedidoMarcacao } from '../../../models/marcacao.interface';
import { MarcacaoService } from '../../../core/services/marcacao';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-marcacoes',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './marcacoes.component.html',
  styleUrls: ['./marcacoes.component.css']
})
export class MarcacoesComponent {
  marcacoes: PedidoMarcacao[] = []
  isDropdownOpen = false;
  selectedFilterValue: string = 'Últimos dias'; // Valor inicial do filtro selecionado
  triggerButtonText: string = 'Últimos dias'; // Texto inicial do botão
  searchTerm: string = '';

  authService = inject(AuthService)
  currentUser = this.authService.currentUser

  filterOptions: FilterOption[] = [
    { id: 'filter-radio-example-1', value: 'Últimos dias', label: 'Últimos dias' },
    { id: 'filter-radio-example-2', value: 'Últimos 7 dias', label: 'Últimos 7 dias' },
    { id: 'filter-radio-example-3', value: 'Últimos 30 dias', label: 'Últimos dias', checked: true },
    { id: 'filter-radio-example-4', value: 'Últimos meses', label: 'Últimos meses' },
    { id: 'filter-radio-example-5', value: 'Últimos Anos', label: 'Últimos Anos' }
  ];
  constructor(private marcacaoService: MarcacaoService) {
    this.updateTriggerButtonText();
    this.carregarUtentes();

    console.log(this.marcacoes)
  }
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectFilter(option: FilterOption): void {
    this.selectedFilterValue = option.value;
    this.triggerButtonText = option.label; // Atualiza o texto do botão principal
    this.isDropdownOpen = false; // Fecha o dropdown após a seleção
    console.log('Filtro selecionado:', this.selectedFilterValue);
    // Aqui você pode emitir um evento com o valor selecionado ou chamar um serviço
  }

  updateTriggerButtonText(): void {
    const selectedOption = this.filterOptions.find(opt => opt.value === this.selectedFilterValue);
    if (selectedOption) {
      this.triggerButtonText = selectedOption.label;
    }
  }


  carregarUtentes(): void {
  this.marcacaoService.getMarcacoes().subscribe({
    next: (res) => {
      // Verifica se o usuário atual é administrativo
      if (this.authService.isAdminFull() && !this.authService.isUtente()) {
        this.marcacoes = res.filter(m => m?.estado.toLowerCase() !== 'pedido');
      } else {
        this.marcacoes = res;
      }
    },
    error: (err) => console.error('Erro ao buscar marcações:', err)
  });
}

  // Métodos para estatísticas
  getPendingCount(): number {
    return this.marcacoes.filter(m => m.estado === 'Pedido').length;
  }

  getConfirmedCount(): number {
    return this.marcacoes.filter(m => m.estado === 'Agendado').length;
  }

  getCompletedCount(): number {
    return this.marcacoes.filter(m => m.estado === 'Realizado').length;
  }

  // Método para filtrar marcações baseado na pesquisa
  getFilteredMarcacoes(): PedidoMarcacao[] {
    if (!this.searchTerm.trim()) {
      return this.marcacoes;
    }
    
    const search = this.searchTerm.toLowerCase();
    return this.marcacoes.filter(marcacao => 
      marcacao.dataInicioPreferida?.toLowerCase().includes(search) ||
      marcacao.dataFimPreferida?.toLowerCase().includes(search) ||
      marcacao.horarioPreferido?.toLowerCase().includes(search) ||
      marcacao.observacoes?.toLowerCase().includes(search) ||
      marcacao.estado?.toLowerCase().includes(search) ||
      marcacao.actosClinicos?.some(acto => 
        acto.tipo?.toLowerCase().includes(search)
      )
    );
  }
}
