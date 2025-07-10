import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
 utente = {
    nome: 'João Silva',
    email: 'joao.silva@email.com',
    telefone: '+244 923 456 789',
    dataNascimento: '1985-06-15',
    genero: 'Masculino',
    pais:'Angola, Luanda',
    endereco: 'Talatóna, Benfica, Rua das Acácias',
    numeroUtente: 'UTN-00123',
    dataCadastro: '2023-08-10',
    tipoUsuario: 'Registado',
    estadoCivil: 'Solteiro',
    ultimaMarcacao: '2024-05-10',
    password: '',
    foto: '',
  };

  onFotoChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.utente.foto = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}
