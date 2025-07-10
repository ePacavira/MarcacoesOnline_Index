
import { Component, inject} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UtenteService } from '../../../core/services/utentes.service';
import { IUtente } from '../../../models/utente.interface';
import { FilterOption } from '../../../models/marcacao.interface';
@Component({
  selector: 'app-utente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './pacientes.component.html',
})
export class UtenteComponent {
  utentes: IUtente[] = [];

  isDropdownOpen = false;
  selectedFilterValue: string = 'Últimos dias';
  triggerButtonText: string = 'Últimos dias';

  filterOptions: FilterOption[] = [
    { id: 'filter-radio-1', value: 'Últimos dias', label: 'Últimos dias' },
    { id: 'filter-radio-2', value: 'Últimos 7 dias', label: 'Últimos 7 dias' },
    { id: 'filter-radio-3', value: 'Últimos 30 dias', label: 'Últimos 30 dias' },
    { id: 'filter-radio-4', value: 'Últimos meses', label: 'Últimos meses' },
    { id: 'filter-radio-5', value: 'Últimos anos', label: 'Últimos anos' }
  ];

  
  constructor(private utenteService: UtenteService) {
    this.updateTriggerButtonText();
    this.carregarUtentes();
  }


  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectFilter(option: FilterOption): void {
    this.selectedFilterValue = option.value;
    this.triggerButtonText = option.label;
    this.isDropdownOpen = false;
    console.log('Filtro selecionado:', this.selectedFilterValue);
    this.carregarUtentes();
  }

  updateTriggerButtonText(): void {
    const selectedOption = this.filterOptions.find(opt => opt.value === this.selectedFilterValue);
    if (selectedOption) {
      this.triggerButtonText = selectedOption.label;
    }
  }

  carregarUtentes(): void {
    // Aqui é onde você aplicaria filtros reais (datas, etc.) se necessário
    this.utenteService.getUtentes().subscribe({
      next: (res) => (this.utentes = res),
      error: (err) => console.error('Erro ao buscar utentes:', err)
    });
  }
}
