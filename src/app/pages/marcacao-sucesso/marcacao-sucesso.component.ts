import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-marcacao-sucesso',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `<div class="flex items-center justify-center min-h-screen bg-gray-100">
  <div class="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
 <div class="flex justify-center mb-4">
  <svg class="w-20 h-20 text-green-500" fill="currentColor" viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" 
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
      clip-rule="evenodd" />
  </svg>
</div>

    <h2 class="text-2xl font-semibold text-gray-800 mb-2">Marcação realizada com sucesso!</h2>
    <p class="text-gray-600">
      Em breve receberá uma mensagem no seu email com mais detalhes sobre a marcação.
    </p>
    <button
      class="mt-6 px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition">
      <a routerLink="/">Voltar à página inicial</a>
    </button>
  </div>
</div>`
})
export class MarcacaoSucessoComponent { }
