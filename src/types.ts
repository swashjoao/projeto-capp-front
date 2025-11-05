export type StatusPresenca = 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADA';

export interface Aula {
    id: string;
    data: string;
    titulo: string;
    descricao?: string;
}

export interface Oficina {
    id: string;
    titulo: string;
    descricao: string;
    alunos?: Aluno[];
}

export interface Aluno {
    id: string;
    nome: string;
    data_nascimento?: string;
    idade?: number;
    email?: string;
    telefone?: string;
    frequencia?: number;
    ativo?: boolean;
}

export interface Parecer {
    id?: string;
    alunoId: string;
    texto: string;
    data?: string;
}
export interface DashboardResumo {
    totalAlunos: number;
    frequenciaMedia: number;
    pareceresPendentes: number;
}

