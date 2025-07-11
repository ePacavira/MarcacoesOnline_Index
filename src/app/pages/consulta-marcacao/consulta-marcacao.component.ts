import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AnonymousAppointment } from '../../core/models/anonymous-appointment.model';
import { AnonymousAppointmentService } from '../../core/services/anonymous-appointment.service';

@Component({
  selector: 'app-consulta-marcacao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './consulta-marcacao.component.html',
  styleUrls: ['./consulta-marcacao.component.css']
})
export class ConsultaMarcacaoComponent {
  searchForm: FormGroup;
  appointment: AnonymousAppointment | null = null;
  isLoading = false;
  errorMessage = '';
  showResults = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private appointmentService: AnonymousAppointmentService
  ) {
    this.searchForm = this.fb.group({
      referenceCode: ['', [Validators.required, Validators.pattern(/^MAR[A-Z0-9]+$/)]]
    });
  }

  async searchAppointment(): Promise<void> {
    if (this.searchForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.showResults = false;

      try {
        const referenceCode = this.searchForm.get('referenceCode')?.value;
        const result = await this.appointmentService.getAppointmentByReference(referenceCode).toPromise();
        
        if (result) {
          // Mapeia o estado numérico para string
          const statusMap: any = {
            0: 'pending',
            1: 'confirmed',
            2: 'cancelled'
          };
          // Mapeia os dados do backend para o formato esperado pelo template
          this.appointment = {
            ...result,
            patient: {
              name: result.utente?.nomeCompleto,
              email: result.utente?.email,
              phone: result.utente?.telemovel,
              birthDate: result.utente?.dataNascimento,
              address: result.utente?.morada,
              genero: result.utente?.genero
            },
            status: statusMap[result.estado] || 'pending',
            referenceCode: result.codigoReferencia || result.id,
            appointment: {
              date: result.dataInicioPreferida,
              time: result.horarioPreferido,
              notes: result.observacoes
            },
            createdAt: result.dataCriacao || null
          };
          this.showResults = true;
        } else {
          this.errorMessage = 'Marcação não encontrada. Verifique o código de referência.';
        }
      } catch (error) {
        console.error('Erro ao buscar marcação:', error);
        this.errorMessage = 'Erro ao buscar marcação. Tente novamente.';
      } finally {
        this.isLoading = false;
      }
    }
  }

  async cancelAppointment(): Promise<void> {
    if (this.appointment && confirm('Tem certeza que deseja cancelar esta marcação?')) {
      this.isLoading = true;
      
      try {
        const updatedAppointment = await this.appointmentService.cancelAppointment(this.appointment.referenceCode).toPromise();
        if (updatedAppointment) {
          this.appointment = updatedAppointment;
          alert('Marcação cancelada com sucesso!');
        }
      } catch (error) {
        console.error('Erro ao cancelar marcação:', error);
        alert('Erro ao cancelar marcação. Tente novamente.');
      } finally {
        this.isLoading = false;
      }
    }
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToNewAppointment(): void {
    this.router.navigate(['/marcacao-anonima']);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelada';
      default: return 'Desconhecido';
    }
  }
} 