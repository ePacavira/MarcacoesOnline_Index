import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-marcacao-sucesso',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div class="max-w-2xl mx-auto px-4">
        <div class="bg-white shadow-xl rounded-2xl p-8 text-center">
          <!-- Success Icon -->
          <div class="flex justify-center mb-6">
            <div class="w-20 h-20 bg-[#ffd700] rounded-full flex items-center justify-center">
              <svg class="w-12 h-12 text-[#00548d]" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                  clip-rule="evenodd" />
              </svg>
            </div>
          </div>

          <!-- Success Message -->
          <h2 class="text-3xl font-bold text-[#00548d] mb-4">Marcação Confirmada!</h2>
          <p class="text-gray-600 mb-6">
            Sua marcação foi realizada com sucesso. Em breve receberá uma confirmação por email.
          </p>

          <!-- Reference Code -->
          <div *ngIf="referenceCode" class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 class="text-lg font-semibold text-[#00548d] mb-2">Código de Referência</h3>
            <div class="bg-white border border-[#00548d] rounded-lg p-4 mb-4">
              <p class="text-2xl font-mono font-bold text-[#00548d]">{{ referenceCode }}</p>
            </div>
            <p class="text-sm text-blue-700">
              Guarde este código para consultar ou cancelar sua marcação posteriormente.
            </p>
          </div>

          <!-- Next Steps -->
          <div class="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 class="text-lg font-semibold text-[#00548d] mb-4">Próximos Passos</h3>
            <div class="space-y-3 text-left">
              <div class="flex items-start">
                <div class="w-6 h-6 bg-[#00548d] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                <p class="text-gray-700">Receberá um email de confirmação com todos os detalhes</p>
              </div>
              <div class="flex items-start">
                <div class="w-6 h-6 bg-[#00548d] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                <p class="text-gray-700">Chegue 10 minutos antes do horário agendado</p>
              </div>
              <div class="flex items-start">
                <div class="w-6 h-6 bg-[#00548d] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                <p class="text-gray-700">Traga um documento de identificação</p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              (click)="goToHome()"
              class="px-6 py-3 bg-[#00548d] text-white rounded-lg hover:bg-[#0077cc] transition-colors">
              Voltar à Página Inicial
            </button>
            <button
              (click)="consultarMarcacao()"
              class="px-6 py-3 border border-[#00548d] text-[#00548d] rounded-lg hover:bg-[#00548d] hover:text-white transition-colors">
              Consultar Marcação
            </button>
          </div>

          <!-- Help Section -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <p class="text-sm text-gray-500 mb-2">Precisa de ajuda?</p>
            <div class="flex justify-center space-x-4 text-sm">
              <a href="mailto:suporte&#64;medi.pt" class="text-[#00548d] hover:text-[#0077cc]">suporte&#64;medi.pt</a>
              <span class="text-gray-400">|</span>
              <a href="tel:+351123456789" class="text-[#00548d] hover:text-[#0077cc]">+351 123 456 789</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
})
export class MarcacaoSucessoComponent implements OnInit {
  referenceCode: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obter o código de referência dos query params
    this.route.queryParams.subscribe(params => {
      this.referenceCode = params['reference'] || null;
    });
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  consultarMarcacao(): void {
    this.router.navigate(['/consulta-marcacao']);
  }
}
