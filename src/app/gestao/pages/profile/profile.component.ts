import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
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
  };
}
