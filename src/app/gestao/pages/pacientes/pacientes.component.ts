
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user.model';
import { UtenteService } from '../../../core/services/utentes.service';
import { FilterOption } from '../../../models/marcacao.interface';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-utente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class UtenteComponent {
  utentes: User[] = [];

  isDropdownOpen = false;
  selectedFilterValue: string = 'Últimos dias';
  triggerButtonText: string = 'Últimos dias';

  authService = inject(AuthService)
  currentUser = this.authService.currentUser

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
    this.utenteService.getUtentes().subscribe({
      next: (res) => {
        // Verifica se o usuário atual é administrativo
        if (this.authService.isAdminFull() && !this.authService.isUtente()) {
          this.utentes = res.filter(u => u?.anonimo === false);
        } else {
          this.utentes = res;
        }
      },
      error: (err) => console.error('Erro ao buscar utentes:', err)
    });
  }
}
