import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Marcacao {
  id: number;
  utenteId: number;
  tipoConsulta: string;
  dataInicioPreferida: Date;
  horarioPreferido: string;
  medico: string;
  local: string;
  estado: 'Pendente' | 'Confirmada' | 'Cancelada' | 'Realizada';
  observacoes?: string;
  codigoReferencia?: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
}

export interface FiltroMarcacao {
  estado?: string;
  periodo?: string;
  termoPesquisa?: string;
  utenteId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MarcacaoService {
  private marcacoes: Marcacao[] = [
    {
      id: 1,
      utenteId: 1,
      tipoConsulta: 'Consulta Geral',
      dataInicioPreferida: new Date('2024-01-15'),
      horarioPreferido: '10:00',
      medico: 'Dr. João Silva',
      local: 'Clínica Medi - Lisboa',
      estado: 'Confirmada',
      observacoes: 'Trazer exames recentes',
      codigoReferencia: 'REF001',
      dataCriacao: new Date('2024-01-10'),
      dataAtualizacao: new Date('2024-01-12')
    },
    {
      id: 2,
      utenteId: 1,
      tipoConsulta: 'Exame Clínico',
      dataInicioPreferida: new Date('2024-01-20'),
      horarioPreferido: '14:30',
      medico: 'Dra. Maria Santos',
      local: 'Clínica Medi - Porto',
      estado: 'Pendente',
      observacoes: '',
      codigoReferencia: 'REF002',
      dataCriacao: new Date('2024-01-12'),
      dataAtualizacao: new Date('2024-01-12')
    },
    {
      id: 3,
      utenteId: 1,
      tipoConsulta: 'Consulta de Especialidade',
      dataInicioPreferida: new Date('2023-12-10'),
      horarioPreferido: '09:00',
      medico: 'Dr. Carlos Oliveira',
      local: 'Clínica Medi - Lisboa',
      estado: 'Realizada',
      observacoes: 'Consulta realizada com sucesso',
      codigoReferencia: 'REF003',
      dataCriacao: new Date('2023-12-05'),
      dataAtualizacao: new Date('2023-12-10')
    },
    {
      id: 4,
      utenteId: 1,
      tipoConsulta: 'Exame de Sangue',
      dataInicioPreferida: new Date('2023-11-25'),
      horarioPreferido: '08:00',
      medico: 'Dra. Ana Costa',
      local: 'Clínica Medi - Lisboa',
      estado: 'Cancelada',
      observacoes: 'Cancelado pelo utente',
      codigoReferencia: 'REF004',
      dataCriacao: new Date('2023-11-20'),
      dataAtualizacao: new Date('2023-11-24')
    }
  ];

  constructor() {}

  // Obter todas as marcações de um utente
  getMarcacoesUtente(utenteId: number, filtros?: FiltroMarcacao): Observable<Marcacao[]> {
    let marcacoes = this.marcacoes.filter(m => m.utenteId === utenteId);

    if (filtros) {
      marcacoes = this.aplicarFiltros(marcacoes, filtros);
    }

    return of(marcacoes).pipe(delay(500)); // Simular delay de rede
  }

  // Obter marcação por ID
  getMarcacaoPorId(id: number): Observable<Marcacao | null> {
    const marcacao = this.marcacoes.find(m => m.id === id);
    return of(marcacao || null).pipe(delay(300));
  }

  // Obter marcação por código de referência
  getMarcacaoPorCodigo(codigo: string): Observable<Marcacao | null> {
    const marcacao = this.marcacoes.find(m => m.codigoReferencia === codigo);
    return of(marcacao || null).pipe(delay(300));
  }

  // Criar nova marcação
  criarMarcacao(marcacao: Omit<Marcacao, 'id' | 'dataCriacao' | 'dataAtualizacao'>): Observable<Marcacao> {
    const novaMarcacao: Marcacao = {
      ...marcacao,
      id: Math.max(...this.marcacoes.map(m => m.id)) + 1,
      codigoReferencia: this.gerarCodigoReferencia(),
      dataCriacao: new Date(),
      dataAtualizacao: new Date()
    };

    this.marcacoes.push(novaMarcacao);
    return of(novaMarcacao).pipe(delay(800));
  }

  // Atualizar marcação
  atualizarMarcacao(id: number, dados: Partial<Marcacao>): Observable<Marcacao | null> {
    const index = this.marcacoes.findIndex(m => m.id === id);
    if (index === -1) {
      return of(null);
    }

    this.marcacoes[index] = {
      ...this.marcacoes[index],
      ...dados,
      dataAtualizacao: new Date()
    };

    return of(this.marcacoes[index]).pipe(delay(500));
  }

  // Cancelar marcação
  cancelarMarcacao(id: number, motivo?: string): Observable<boolean> {
    const index = this.marcacoes.findIndex(m => m.id === id);
    if (index === -1) {
      return of(false);
    }

    this.marcacoes[index] = {
      ...this.marcacoes[index],
      estado: 'Cancelada',
      observacoes: motivo || 'Cancelado pelo utente',
      dataAtualizacao: new Date()
    };

    return of(true).pipe(delay(500));
  }

  // Obter estatísticas do utente
  getEstatisticasUtente(utenteId: number): Observable<{
    total: number;
    pendentes: number;
    confirmadas: number;
    canceladas: number;
    realizadas: number;
  }> {
    const marcacoesUtente = this.marcacoes.filter(m => m.utenteId === utenteId);
    
    const estatisticas = {
      total: marcacoesUtente.length,
      pendentes: marcacoesUtente.filter(m => m.estado === 'Pendente').length,
      confirmadas: marcacoesUtente.filter(m => m.estado === 'Confirmada').length,
      canceladas: marcacoesUtente.filter(m => m.estado === 'Cancelada').length,
      realizadas: marcacoesUtente.filter(m => m.estado === 'Realizada').length
    };

    return of(estatisticas).pipe(delay(300));
  }

  // Obter próximas marcações (confirmadas)
  getProximasMarcacoes(utenteId: number, limite: number = 5): Observable<Marcacao[]> {
    const hoje = new Date();
    const proximas = this.marcacoes
      .filter(m => 
        m.utenteId === utenteId && 
        m.estado === 'Confirmada' && 
        m.dataInicioPreferida >= hoje
      )
      .sort((a, b) => a.dataInicioPreferida.getTime() - b.dataInicioPreferida.getTime())
      .slice(0, limite);

    return of(proximas).pipe(delay(400));
  }

  // Aplicar filtros
  private aplicarFiltros(marcacoes: Marcacao[], filtros: FiltroMarcacao): Marcacao[] {
    let resultado = [...marcacoes];

    // Filtro por estado
    if (filtros.estado) {
      resultado = resultado.filter(m => 
        m.estado.toLowerCase() === filtros.estado!.toLowerCase()
      );
    }

    // Filtro por período
    if (filtros.periodo) {
      const hoje = new Date();
      const inicioSemana = new Date(hoje);
      inicioSemana.setDate(hoje.getDate() - hoje.getDay());
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

      resultado = resultado.filter(m => {
        const dataMarcacao = new Date(m.dataInicioPreferida);
        switch (filtros.periodo) {
          case 'hoje':
            return dataMarcacao.toDateString() === hoje.toDateString();
          case 'semana':
            return dataMarcacao >= inicioSemana;
          case 'mes':
            return dataMarcacao >= inicioMes;
          case 'passado':
            return dataMarcacao < hoje;
          default:
            return true;
        }
      });
    }

    // Filtro por pesquisa
    if (filtros.termoPesquisa) {
      const termo = filtros.termoPesquisa.toLowerCase();
      resultado = resultado.filter(m =>
        m.tipoConsulta.toLowerCase().includes(termo) ||
        m.medico.toLowerCase().includes(termo) ||
        m.local.toLowerCase().includes(termo) ||
        m.codigoReferencia?.toLowerCase().includes(termo)
      );
    }

    return resultado;
  }

  // Gerar código de referência único
  private gerarCodigoReferencia(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `REF${timestamp}${random}`.toUpperCase();
  }

  // Enviar notificação de confirmação
  enviarNotificacaoConfirmacao(marcacao: Marcacao): Observable<boolean> {
    console.log('Enviando notificação de confirmação para:', marcacao);
    // Aqui implementaria a lógica de envio de email/SMS
    return of(true).pipe(delay(1000));
  }

  // Enviar notificação de cancelamento
  enviarNotificacaoCancelamento(marcacao: Marcacao): Observable<boolean> {
    console.log('Enviando notificação de cancelamento para:', marcacao);
    // Aqui implementaria a lógica de envio de email/SMS
    return of(true).pipe(delay(1000));
  }
} 