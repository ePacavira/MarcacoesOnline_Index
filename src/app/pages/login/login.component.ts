import { Component, inject, signal } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, ActivatedRoute } from "@angular/router"
import { AuthService } from "../../core/services/auth.service"

@Component({
  selector: 'app-login',
  imports: [  ReactiveFormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  hasAccess = false; // ou true, dependendo da lógica

  loginForm: FormGroup
  isLoading = signal(false)
  errorMessage = signal("")

  constructor() {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
    })
        if (this.authService.isLoggedIn()) {
      // redireciona se já estiver logado
      this.router.navigate(['/gestao']);
    }
  }
  onSubmit(): void {
      console.log(this.loginForm.value)
    if (this.loginForm.valid) {
      this.isLoading.set(true)
      this.errorMessage.set("")

      const credentials = this.loginForm.value
    

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading.set(false)
          const returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/"

          // Redirecionar baseado no papel do usuário
          if (response.user.perfil === "Administrativo" || response.user.perfil === "Administrador") {
            console.log(response.user.perfil)
            this.router.navigate(["/gestao"])
          } else {
            this.router.navigate(["/paciente"])
          }
        },
        error: (error) => {
          this.isLoading.set(false)
          this.errorMessage.set("Email ou senha inválidos. Tente novamente.")
          console.error("Erro no login:", error)
        },
      })
    }
  }

}
