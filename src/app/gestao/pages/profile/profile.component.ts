import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms"
import { AuthService } from "../../../core/services/auth.service"

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="profile-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">Meu Perfil</h1>
          <p class="page-subtitle">Gerencie suas informações pessoais e preferências</p>
        </div>
        <div class="header-right">
          <button 
            class="save-btn" 
            (click)="salvarPerfil()"
            [disabled]="!perfilForm.valid || !perfilForm.dirty"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17,21 17,13 7,13 7,21"/>
              <polyline points="7,3 7,8 15,8"/>
            </svg>
            Salvar Alterações
          </button>
        </div>
      </div>

      <div class="profile-content">
        <!-- Foto de Perfil -->
        <div class="profile-photo-section">
          <div class="photo-container">
            <img 
              [src]="fotoPerfil || '/assets/default-avatar.png'" 
              alt="Foto de perfil" 
              class="profile-photo"
            />
            <div class="photo-overlay" (click)="selecionarFoto()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              <span>Alterar Foto</span>
            </div>
          </div>
          <input 
            type="file" 
            #fileInput 
            (change)="onFileSelected($event)" 
            accept="image/*" 
            style="display: none;"
          />
          <div class="photo-info">
            <h3>Foto de Perfil</h3>
            <p>Clique na foto para alterar. Formatos aceites: JPG, PNG (máx. 2MB)</p>
          </div>
        </div>

        <!-- Formulário de Dados Pessoais -->
        <div class="form-section">
          <h2>Dados Pessoais</h2>
          <form [formGroup]="perfilForm" class="profile-form">
            <div class="form-grid">
              <div class="form-group">
                <label for="nome">Nome Completo *</label>
                <input 
                  type="text" 
                  id="nome" 
                  formControlName="nome"
                  placeholder="Digite seu nome completo"
                />
                <div class="error-message" *ngIf="perfilForm.get('nome')?.invalid && perfilForm.get('nome')?.touched">
                  Nome é obrigatório
                </div>
              </div>

              <div class="form-group">
                <label for="email">Email *</label>
                <input 
                  type="email" 
                  id="email" 
                  formControlName="email"
                  placeholder="seu@email.com"
                />
                <div class="error-message" *ngIf="perfilForm.get('email')?.invalid && perfilForm.get('email')?.touched">
                  <span *ngIf="perfilForm.get('email')?.errors?.['required']">Email é obrigatório</span>
                  <span *ngIf="perfilForm.get('email')?.errors?.['email']">Email inválido</span>
                </div>
              </div>

              <div class="form-group">
                <label for="telefone">Telefone *</label>
                <input 
                  type="tel" 
                  id="telefone" 
                  formControlName="telefone"
                  placeholder="+351 123 456 789"
                />
                <div class="error-message" *ngIf="perfilForm.get('telefone')?.invalid && perfilForm.get('telefone')?.touched">
                  Telefone é obrigatório
                </div>
              </div>

              <div class="form-group">
                <label for="dataNascimento">Data de Nascimento *</label>
                <input 
                  type="date" 
                  id="dataNascimento" 
                  formControlName="dataNascimento"
                />
                <div class="error-message" *ngIf="perfilForm.get('dataNascimento')?.invalid && perfilForm.get('dataNascimento')?.touched">
                  Data de nascimento é obrigatória
                </div>
              </div>

              <div class="form-group full-width">
                <label for="endereco">Endereço Completo</label>
                <textarea 
                  id="endereco" 
                  formControlName="endereco"
                  placeholder="Rua, número, código postal, cidade"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label for="nif">NIF</label>
                <input 
                  type="text" 
                  id="nif" 
                  formControlName="nif"
                  placeholder="123456789"
                />
              </div>

              <div class="form-group">
                <label for="numeroUtente">Número de Utente</label>
                <input 
                  type="text" 
                  id="numeroUtente" 
                  formControlName="numeroUtente"
                  placeholder="123456789"
                  readonly
                />
                <small class="help-text">Número de utente não pode ser alterado</small>
              </div>
            </div>
          </form>
        </div>

        <!-- Preferências -->
        <div class="form-section">
          <h2>Preferências de Comunicação</h2>
          <div class="preferences-grid">
            <div class="preference-item">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  formControlName="notificacoesEmail"
                  class="checkbox-input"
                />
                <span class="checkmark"></span>
                Receber notificações por email
              </label>
              <p class="preference-description">
                Receba lembretes de consultas e atualizações por email
              </p>
            </div>

            <div class="preference-item">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  formControlName="notificacoesSMS"
                  class="checkbox-input"
                />
                <span class="checkmark"></span>
                Receber notificações por SMS
              </label>
              <p class="preference-description">
                Receba lembretes de consultas por mensagem de texto
              </p>
            </div>

            <div class="preference-item">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  formControlName="newsletter"
                  class="checkbox-input"
                />
                <span class="checkmark"></span>
                Receber newsletter da clínica
              </label>
              <p class="preference-description">
                Receba informações sobre serviços e promoções
              </p>
            </div>
          </div>
        </div>

        <!-- Informações de Segurança -->
        <div class="form-section">
          <h2>Segurança da Conta</h2>
          <div class="security-actions">
            <div class="security-item">
              <div class="security-info">
                <h4>Alterar Password</h4>
                <p>Atualize sua password para manter a conta segura</p>
              </div>
              <button class="security-btn" (click)="alterarPassword()">
                Alterar Password
              </button>
            </div>

            <div class="security-item">
              <div class="security-info">
                <h4>Autenticação de Dois Fatores</h4>
                <p>Adicione uma camada extra de segurança à sua conta</p>
              </div>
              <button class="security-btn" (click)="configurar2FA()">
                Configurar 2FA
              </button>
            </div>

            <div class="security-item">
              <div class="security-info">
                <h4>Histórico de Login</h4>
                <p>Veja onde e quando sua conta foi acedida</p>
              </div>
              <button class="security-btn" (click)="verHistoricoLogin()">
                Ver Histórico
              </button>
            </div>
          </div>
        </div>

        <!-- Ações da Conta -->
        <div class="form-section danger-zone">
          <h2>Zona de Perigo</h2>
          <div class="danger-actions">
            <div class="danger-item">
              <div class="danger-info">
                <h4>Excluir Conta</h4>
                <p>Esta ação é irreversível. Todos os seus dados serão permanentemente removidos.</p>
              </div>
              <button class="danger-btn" (click)="excluirConta()">
                Excluir Conta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: #00548d;
      margin: 0;
    }

    .page-subtitle {
      font-size: 1.1rem;
      color: #666;
      margin: 0.5rem 0 0 0;
    }

    .save-btn {
      background: #00548d;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }

    .save-btn:hover:not(:disabled) {
      background: #0077cc;
    }

    .save-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .save-btn svg {
      width: 20px;
      height: 20px;
    }

    .profile-content {
      display: grid;
      gap: 2rem;
    }

    .profile-photo-section {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }

    .photo-container {
      position: relative;
      display: inline-block;
      margin-bottom: 1rem;
    }

    .profile-photo {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #e6f1fa;
    }

    .photo-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.7);
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      opacity: 0;
      transition: opacity 0.2s;
      cursor: pointer;
    }

    .photo-overlay:hover {
      opacity: 1;
    }

    .photo-overlay svg {
      width: 24px;
      height: 24px;
      margin-bottom: 0.5rem;
    }

    .photo-info h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .photo-info p {
      color: #666;
      font-size: 0.9rem;
      margin: 0;
    }

    .form-section {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .form-section h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #00548d;
      margin: 0 0 1.5rem 0;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-group label {
      font-weight: 500;
      color: #333;
    }

    .form-group input,
    .form-group textarea {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #00548d;
      box-shadow: 0 0 0 3px rgba(0,84,141,0.1);
    }

    .form-group input[readonly] {
      background: #f8f9fa;
      color: #666;
    }

    .error-message {
      color: #dc2626;
      font-size: 0.8rem;
    }

    .help-text {
      color: #666;
      font-size: 0.8rem;
    }

    .preferences-grid {
      display: grid;
      gap: 1.5rem;
    }

    .preference-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      font-weight: 500;
    }

    .checkbox-input {
      display: none;
    }

    .checkmark {
      width: 20px;
      height: 20px;
      border: 2px solid #ddd;
      border-radius: 4px;
      position: relative;
      transition: all 0.2s;
    }

    .checkbox-input:checked + .checkmark {
      background: #00548d;
      border-color: #00548d;
    }

    .checkbox-input:checked + .checkmark::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 12px;
      font-weight: bold;
    }

    .preference-description {
      color: #666;
      font-size: 0.9rem;
      margin: 0 0 0 2rem;
    }

    .security-actions {
      display: grid;
      gap: 1rem;
    }

    .security-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }

    .security-info h4 {
      margin: 0 0 0.25rem 0;
      color: #333;
    }

    .security-info p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .security-btn {
      background: transparent;
      color: #00548d;
      border: 1px solid #00548d;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .security-btn:hover {
      background: #00548d;
      color: white;
    }

    .danger-zone {
      border: 1px solid #fee2e2;
      background: #fef2f2;
    }

    .danger-zone h2 {
      color: #dc2626;
    }

    .danger-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border: 1px solid #fecaca;
      border-radius: 8px;
      background: white;
    }

    .danger-info h4 {
      margin: 0 0 0.25rem 0;
      color: #dc2626;
    }

    .danger-info p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .danger-btn {
      background: #dc2626;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .danger-btn:hover {
      background: #b91c1c;
    }

    @media (max-width: 768px) {
      .profile-container {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .security-item,
      .danger-item {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  perfilForm: FormGroup;
  fotoPerfil: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.perfilForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      endereco: [''],
      nif: [''],
      numeroUtente: [''],
      notificacoesEmail: [true],
      notificacoesSMS: [true],
      newsletter: [false]
    });
  }

  ngOnInit() {
    this.carregarDadosPerfil();
  }

  carregarDadosPerfil() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.perfilForm.patchValue({
        nome: user.nome || '',
        email: user.email || '',
        telefone: user.telefone || '',
        dataNascimento: user.dataNascimento || '',
        endereco: user.endereco || '',
        nif: user.nif || '',
        numeroUtente: user.numeroUtente || '',
        notificacoesEmail: user.notificacoesEmail !== false,
        notificacoesSMS: user.notificacoesSMS !== false,
        newsletter: user.newsletter || false
      });
      
      this.fotoPerfil = user.foto || null;
    }
  }

  selecionarFoto() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('A imagem deve ter menos de 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoPerfil = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  salvarPerfil() {
    if (this.perfilForm.valid) {
      const dadosAtualizados = {
        ...this.perfilForm.value,
        foto: this.fotoPerfil
      };

      console.log('Salvando perfil:', dadosAtualizados);
      
      // Aqui você implementaria a chamada para o serviço
      // this.authService.atualizarPerfil(dadosAtualizados).subscribe(...)
      
      alert('Perfil atualizado com sucesso!');
      this.perfilForm.markAsPristine();
    } else {
      this.marcarCamposComoTocados();
    }
  }

  marcarCamposComoTocados() {
    Object.keys(this.perfilForm.controls).forEach(key => {
      const control = this.perfilForm.get(key);
      control?.markAsTouched();
    });
  }

  alterarPassword() {
    console.log('Abrir modal de alteração de password');
    // Implementar modal ou navegação
  }

  configurar2FA() {
    console.log('Configurar autenticação de dois fatores');
    // Implementar configuração 2FA
  }

  verHistoricoLogin() {
    console.log('Ver histórico de login');
    // Implementar visualização do histórico
  }

  excluirConta() {
    if (confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.')) {
      console.log('Excluir conta');
      // Implementar exclusão da conta
    }
  }
}
