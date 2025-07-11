import { Component, type OnInit, signal } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms"
import { AuthService } from "../../../core/services/auth.service"
import { UserProfileService } from "../../../core/services/user-profile.service"

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
            [disabled]="!perfilForm.valid || !perfilForm.dirty || isLoading()"
          >
            @if (isLoading()) {
              <svg class="loading-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
              A guardar...
            } @else {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17,21 17,13 7,13 7,21"/>
                <polyline points="7,3 7,8 15,8"/>
              </svg>
              Salvar Alterações
            }
          </button>
        </div>
      </div>

      <!-- Mensagens de Feedback -->
      @if (successMessage()) {
        <div class="success-message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22,4 12,14.01 9,11.01"/>
          </svg>
          {{ successMessage() }}
        </div>
      }

      @if (errorMessage()) {
        <div class="error-message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {{ errorMessage() }}
        </div>
      }

      <!-- Modal de Alteração de Password -->
      <div *ngIf="showPasswordModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Alterar Password</h2>
          <form [formGroup]="passwordForm" (ngSubmit)="submeterAlteracaoPassword()">
            <div class="form-group">
              <label for="currentPassword">Password Atual</label>
              <input type="password" id="currentPassword" formControlName="currentPassword" required />
            </div>
            <div class="form-group">
              <label for="newPassword">Nova Password</label>
              <input type="password" id="newPassword" formControlName="newPassword" required />
            </div>
            <div class="form-group">
              <label for="confirmPassword">Confirmar Nova Password</label>
              <input type="password" id="confirmPassword" formControlName="confirmPassword" required />
            </div>
            <div class="modal-actions">
              <button type="submit" [disabled]="passwordForm.invalid || isLoading()">Salvar</button>
              <button type="button" (click)="fecharPasswordModal()">Cancelar</button>
            </div>
            <div *ngIf="passwordError" class="error-message">{{ passwordError }}</div>
            <div *ngIf="passwordSuccess" class="success-message">{{ passwordSuccess }}</div>
          </form>
        </div>
      </div>

      <!-- Modal de Exclusão de Conta -->
      <div *ngIf="showDeleteModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Confirmar Exclusão</h2>
          <p>Tem a certeza que deseja excluir a sua conta? Esta ação é irreversível.</p>
          <div class="modal-actions">
            <button (click)="confirmarExcluirConta()" class="danger-btn" [disabled]="isLoading()">Excluir</button>
            <button (click)="fecharDeleteModal()">Cancelar</button>
          </div>
          <div *ngIf="deleteError" class="error-message">{{ deleteError }}</div>
        </div>
      </div>

      <div class="profile-content">
        <!-- Foto de Perfil -->
        <div class="profile-photo-section">
          <div class="photo-container">
            <img 
              [src]="getFotoPerfilSrc()" 
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

              <div class="form-group">
                <label for="nomeCompleto">Nome Completo *</label>
                <input 
                  type="text" 
                  id="nomeCompleto" 
                  formControlName="nomeCompleto"
                  placeholder="Digite seu nome completo"
                />
                <div class="error-message" *ngIf="perfilForm.get('nomeCompleto')?.invalid && perfilForm.get('nomeCompleto')?.touched">
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
                <label for="telemovel">Telemóvel</label>
                <input 
                  type="tel" 
                  id="telemovel" 
                  formControlName="telemovel"
                  placeholder="+351 912 345 678"
                />
              </div>

              <div class="form-group">
                <label for="dataNascimento">Data de Nascimento</label>
                <input 
                  type="date" 
                  id="dataNascimento" 
                  formControlName="dataNascimento"
                />
              </div>

              <div class="form-group">
                <label for="genero">Género</label>
                <select id="genero" formControlName="genero">
                  <option value="">Selecione...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                  <option value="PrefiroNaoIndicar">Prefiro não indicar</option>
                </select>
              </div>

              <div class="form-group full-width">
                <label for="morada">Morada Completa</label>
                <textarea 
                  id="morada" 
                  formControlName="morada"
                  placeholder="Morada completa incluindo código postal"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </form>
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
              <button class="security-btn" (click)="abrirPasswordModal()">
                Alterar Password
              </button>
            </div>
          </div>
        </div>

        <!-- Ações da Conta -->
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 2rem;
      max-width: 1200px;
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
      transition: background 0.2s;
    }

    .save-btn:hover:not(:disabled) {
      background: #003a5c;
    }

    .save-btn:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .loading-spinner {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Mensagens de Feedback */
    .success-message,
    .error-message {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      font-weight: 500;
    }

    .success-message {
      background: #d1fae5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }

    .success-message svg {
      width: 20px;
      height: 20px;
      color: #059669;
    }

    .error-message {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }

    .error-message svg {
      width: 20px;
      height: 20px;
      color: #dc2626;
    }

    .profile-content {
      display: grid;
      gap: 2rem;
    }

    .profile-photo-section,
    .form-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .profile-photo-section {
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
      border: 4px solid #f3f4f6;
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
      color: #1f2937;
    }

    .photo-info p {
      margin: 0;
      color: #6b7280;
      font-size: 0.9rem;
    }

    .form-section h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 1.5rem 0;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-group label {
      display: block;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #00548d;
      box-shadow: 0 0 0 3px rgba(0,84,141,0.1);
    }

    .form-group input[readonly] {
      background: #f9fafb;
      color: #6b7280;
    }

    .help-text {
      font-size: 0.8rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }

    .error-message {
      color: #dc2626;
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }

    .security-actions,
    .danger-actions {
      display: grid;
      gap: 1rem;
    }

    .security-item,
    .danger-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }

    .security-info h4,
    .danger-info h4 {
      margin: 0 0 0.25rem 0;
      color: #1f2937;
    }

    .security-info p,
    .danger-info p {
      margin: 0;
      color: #6b7280;
      font-size: 0.9rem;
    }

    .security-btn {
      background: #f3f4f6;
      color: #374151;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .security-btn:hover {
      background: #e5e7eb;
    }

    .danger-zone {
      border: 1px solid #fecaca;
    }

    .danger-zone h2 {
      color: #dc2626;
    }

    .danger-btn {
      background: #dc2626;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .danger-btn:hover {
      background: #b91c1c;
    }

    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-content {
      background: #fff;
      padding: 2rem;
      border-radius: 10px;
      min-width: 320px;
      max-width: 90vw;
      box-shadow: 0 2px 16px rgba(0,0,0,0.2);
    }
    .modal-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
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
  fotoPerfil: string | null | undefined;
  isLoading = signal(false);
  successMessage = signal("");
  errorMessage = signal("");
  showPasswordModal = false;
  passwordForm: FormGroup;
  passwordError: string = '';
  passwordSuccess: string = '';
  showDeleteModal = false;
  deleteError: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userProfileService: UserProfileService
  ) {
    this.perfilForm = this.fb.group({
      nomeCompleto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      telemovel: [''],
      dataNascimento: [''],
      genero: [''],
      endereco: [''],
      morada: [''],
      numeroUtente: [{value: '', disabled: true}]
    });
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.carregarDadosPerfil();
  }

  carregarDadosPerfil() {
    this.userProfileService.getUserProfile().subscribe({
      next: (user) => {
        this.fotoPerfil = user.fotoPath;
        
        this.perfilForm.patchValue({
          nomeCompleto: user.nomeCompleto,
          email: user.email,
          telefone: user.telefone || '',
          telemovel: user.telemovel || '',
          dataNascimento: user.dataNascimento ? user.dataNascimento.toString().substring(0, 10) : '',
          genero: user.genero || '',
          endereco: user.endereco || '',
          morada: user.morada || '',
          numeroUtente: user.numeroUtente || ''
        });

        // Atualizar dados no AuthService
        this.authService.updateCurrentUser(user);
      },
      error: (error) => {
        console.error('Erro ao carregar dados do perfil:', error);
        this.errorMessage.set("Erro ao carregar dados do perfil. Tente novamente.");
      }
    });
  }

  selecionarFoto() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar tamanho (máx 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.errorMessage.set("A imagem deve ter no máximo 2MB.");
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        this.errorMessage.set("Por favor, selecione uma imagem válida.");
        return;
      }

      this.isLoading.set(true);
      this.errorMessage.set("");

      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.errorMessage.set("Utilizador não autenticado.");
        this.isLoading.set(false);
        return;
      }

      this.userProfileService.uploadPhoto(file, currentUser.id).subscribe({
        next: (response) => {
          this.fotoPerfil = response.fotoPath;
          this.successMessage.set("Foto atualizada com sucesso!");
          this.isLoading.set(false);
          
          // Atualizar dados do utilizador
          currentUser.fotoPath = response.fotoPath;
          this.authService.updateCurrentUser(currentUser);
        },
        error: (error) => {
          console.error('Erro ao fazer upload da foto:', error);
          this.errorMessage.set("Erro ao fazer upload da foto. Tente novamente.");
          this.isLoading.set(false);
        }
      });
    }
  }

  salvarPerfil() {
    if (this.perfilForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set("");
      this.successMessage.set("");

      const formData = this.perfilForm.value;
      
      this.userProfileService.updateProfile(formData).subscribe({
        next: (user) => {
          this.successMessage.set("Perfil atualizado com sucesso!");
          this.isLoading.set(false);
          
          // Atualizar dados no AuthService
          this.authService.updateCurrentUser(user);
          
          // Marcar formulário como não modificado
          this.perfilForm.markAsPristine();
        },
        error: (error) => {
          console.error('Erro ao atualizar perfil:', error);
          this.errorMessage.set("Erro ao atualizar perfil. Tente novamente.");
          this.isLoading.set(false);
        }
      });
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
    // Implementar modal ou página para alterar password
    console.log('Alterar password');
  }

  configurar2FA() {
    // Implementar configuração de 2FA
    console.log('Configurar 2FA');
  }

  verHistoricoLogin() {
    // Implementar histórico de login
    console.log('Ver histórico de login');
  }

  excluirConta() {
    // Implementar exclusão de conta
    console.log('Excluir conta');
  }

  abrirPasswordModal() {
    this.passwordForm.reset();
    this.passwordError = '';
    this.passwordSuccess = '';
    this.showPasswordModal = true;
  }

  fecharPasswordModal() {
    this.showPasswordModal = false;
  }

  submeterAlteracaoPassword() {
    if (this.passwordForm.invalid) return;
    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.passwordError = 'A nova password e a confirmação não coincidem.';
      return;
    }
    this.isLoading.set(true);
    this.passwordError = '';
    this.passwordSuccess = '';
    this.userProfileService.changePassword({ currentPassword, newPassword, confirmPassword }).subscribe({
      next: () => {
        this.passwordSuccess = 'Password alterada com sucesso!';
        this.isLoading.set(false);
        setTimeout(() => this.fecharPasswordModal(), 1500);
      },
      error: (err) => {
        this.passwordError = err?.error?.message || 'Erro ao alterar password.';
        this.isLoading.set(false);
      }
    });
  }

  abrirDeleteModal() {
    this.showDeleteModal = true;
    this.deleteError = '';
  }

  fecharDeleteModal() {
    this.showDeleteModal = false;
  }

  confirmarExcluirConta() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.deleteError = 'Utilizador não autenticado.';
      return;
    }
    this.isLoading.set(true);
    this.deleteError = '';
    this.userProfileService.deleteUser(user.id).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.authService.logout();
        window.location.href = '/';
      },
      error: (err) => {
        this.deleteError = err?.error?.message || 'Erro ao excluir conta.';
        this.isLoading.set(false);
      }
    });
  }

  getFotoPerfilSrc(): string {
    if (this.fotoPerfil) {
      let foto = this.fotoPerfil;
      // Forçar https se necessário
      if (foto.startsWith('http://')) {
        foto = foto.replace('http://', 'https://');
      }
      return foto + '?t=' + Date.now();
    }
    return '/assets/default-avatar.png';
  }
}
