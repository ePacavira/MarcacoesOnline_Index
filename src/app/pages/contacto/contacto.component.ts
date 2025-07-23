import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../core/services/users.service';
import { AuthService } from '../../core/services/auth.service';

interface ContactFormData {
  nome: string;
  email: string;
  telefone: string;
  assunto: string;
  mensagem: string;
  newsletter: boolean;
}

@Component({
  selector: 'app-contacto',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {
  formData: ContactFormData = {
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: '',
    newsletter: false
  };

  isSubmitting = false;
  activeFaq: number | null = null;

  constructor(private usersService: UsersService, private authService: AuthService) {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.formData.nome = user.nomeCompleto || '';
      this.formData.email = user.email || '';
      this.formData.telefone = user.telemovel || user.telefone || '';
    }
  }

  onSubmit() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.usersService.sendContactMessage(this.formData).subscribe({
      next: () => {
        alert('Mensagem enviada com sucesso! Entraremos em contacto consigo em breve.');
        this.clearForm();
        this.isSubmitting = false;
      },
      error: (err) => {
        alert('Erro ao enviar mensagem. Tente novamente mais tarde.');
        this.isSubmitting = false;
      }
    });
  }

  isUserLogged(): boolean {
    return !!this.authService.getCurrentUser();
  }

  clearForm() {
    if (this.isUserLogged()) {
      this.formData.assunto = '';
      this.formData.mensagem = '';
      this.formData.newsletter = false;
    } else {
      this.formData = {
        nome: '',
        email: '',
        telefone: '',
        assunto: '',
        mensagem: '',
        newsletter: false
      };
    }
  }

  toggleFaq(index: number) {
    if (this.activeFaq === index) {
      this.activeFaq = null;
    } else {
      this.activeFaq = index;
    }
  }
}
