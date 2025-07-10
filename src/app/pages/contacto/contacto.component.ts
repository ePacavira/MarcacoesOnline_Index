import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  onSubmit() {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    // Simular envio do formulário
    setTimeout(() => {
      console.log('Formulário enviado:', this.formData);
      
      // Aqui você pode adicionar a lógica real para enviar o formulário
      // Por exemplo, chamar um serviço que faz uma requisição HTTP
      
      alert('Mensagem enviada com sucesso! Entraremos em contacto consigo em breve.');
      this.clearForm();
      this.isSubmitting = false;
    }, 2000);
  }

  clearForm() {
    this.formData = {
      nome: '',
      email: '',
      telefone: '',
      assunto: '',
      mensagem: '',
      newsletter: false
    };
  }

  toggleFaq(index: number) {
    if (this.activeFaq === index) {
      this.activeFaq = null;
    } else {
      this.activeFaq = index;
    }
  }
}
