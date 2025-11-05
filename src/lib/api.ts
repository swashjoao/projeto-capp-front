import axios from 'axios';
import { auth } from '../../firebase/firebase';
import type { StatusPresenca } from '@/types';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000'
});

api.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ---- Endpoints tipados ----
export const Endpoints = {
    me: () => api.get('/me'),
    dashboard: () => api.get('/dashboard/professor'),
    alunos: {
        list: (page = 1, perPage = 100) => api.get('/alunos', { params: { page, perPage } }),
        create: (data: any) => api.post('/alunos', data),
        update: (id: string, data: any) => api.put(`/alunos/${id}`, data),
        remove: (id: string) => api.delete(`/alunos/${id}`),
    },
    parecer: {
        getByAluno: (alunoId: string) => api.get(`/parecer/${alunoId}`),
        upsert: (alunoId: string, data: { texto_parecer: string; ano: number }) =>
            api.post(`/parecer/${alunoId}`, data),
    },
    aulas: {
        minhasOficinas: () => api.get('/aulas/minhas-oficinas'),
        porOficina: (oficinaId: string) => api.get(`/aulas/oficina/${oficinaId}`),
        byId: (aulaId: string) => api.get(`/aulas/${aulaId}`),
    },
    presenca: {
        listByAula: (aulaId: string) => api.get(`/presencas/aula/${aulaId}`),
        salvar: (aulaId: string, presencas: { aluno_id: string; status: 'PRESENTE'|'AUSENTE'|'JUSTIFICADA' }[]) =>
            api.put(`/presencas/aula/${aulaId}`, { presencas }),
    }
} as const;

// ---- MOCK MODE ----
const MOCK = (import.meta as any).env?.VITE_MOCK === '1' || (import.meta as any).env?.VITE_MOCK === 'true';

function mockResponse<T>(data: T, ms = 300): Promise<{ data: T }> {
    return new Promise((resolve) => setTimeout(() => resolve({ data }), ms));
}

if (MOCK) {
    // Dados simulados
    const alunos = [
        { id: 'a1', nome: 'Ana Maria', idade: 12, email: 'ana@example.com', telefone: '11 99999-0001', ativo: true },
        { id: 'a2', nome: 'Bruno Silva', idade: 13, email: 'bruno@example.com', telefone: '11 99999-0002', ativo: true },
        { id: 'a3', nome: 'Carla Souza', idade: 12, email: 'carla@example.com', telefone: '11 99999-0003', ativo: true },
    ];

    const dashboardResumo = {
        totalAlunos: alunos.length,
        frequenciaMedia: 82,
        pareceresPendentes: 2,
    };

    // Sobrescreve Endpoints com mocks sem redeclarar a constante
    Endpoints.me = () => mockResponse({ id: 'mock-user', name: 'Usuário Mock' });
    Endpoints.dashboard = () => mockResponse(dashboardResumo);

    // Alunos
    // @ts-expect-error: reatribuição de objeto interno para mock
    Endpoints.alunos = {
        list: (page = 1, perPage = 100) => mockResponse({ alunos: alunos.slice(0, perPage) }),
        create: (data: any) => mockResponse({ id: (globalThis.crypto?.randomUUID?.() ?? String(Date.now())), ...data }),
        update: (id: string, data: any) => mockResponse({ id, ...data }),
        remove: (id: string) => mockResponse({ ok: true, id }),
    };

    // Parecer
    // @ts-expect-error: reatribuição de objeto interno para mock
    Endpoints.parecer = {
        getByAluno: (alunoId: string) => mockResponse({ alunoId, texto: 'Parecer exemplo', ano: new Date().getFullYear() }),
        upsert: (alunoId: string, data: { texto_parecer: string; ano: number }) => mockResponse({ ok: true, alunoId, ...data }),
    };

    // Aulas
    // @ts-expect-error: reatribuição de objeto interno para mock
    Endpoints.aulas = {
        minhasOficinas: () => mockResponse([{ id: 'of1', titulo: '' +
                'Oficina de Música', descricao: 'Aulas semanais' }]),
        porOficina: (oficinaId: string) => mockResponse([
            { id: 'au1', data: new Date().toISOString(), titulo: 'Aula 1' },
            { id: 'au2', data: new Date().toISOString(), titulo: 'Aula 2' },
        ]),
        byId: (aulaId: string) => mockResponse({ id: aulaId, data: new Date().toISOString(), titulo: 'Aula Detalhe' }),
    };

    // Presença
    // @ts-expect-error: reatribuição de objeto interno para mock
    Endpoints.presenca = {
        listByAula: (aulaId: string) => mockResponse([
            { aluno_id: 'a1', status: 'PRESENTE' },
            { aluno_id: 'a2', status: 'AUSENTE' },
            { aluno_id: 'a3', status: 'JUSTIFICADA' },
        ]),
        salvar: (aulaId: string, presencas: { aluno_id: string; status: 'PRESENTE'|'AUSENTE'|'JUSTIFICADA' }[]) =>
            mockResponse({ ok: true, aulaId, presencas }),
    };

    // Presença
    // @ts-expect-error: reatribuição de objeto interno para mock
    Endpoints.presenca = {
        listByAula: (aulaId: string) => {
            const alunosComPresenca = alunos.map((aluno, index) => ({
                id: aluno.id,
                nome: aluno.nome,
                frequencia: Math.floor(Math.random() * 100),
                status: ['PRESENTE', 'AUSENTE', 'JUSTIFICADA'][index] as StatusPresenca
            }));
            return mockResponse(alunosComPresenca);
        },
        salvar: (aulaId: string, presencas: { aluno_id: string; status: 'PRESENTE'|'AUSENTE'|'JUSTIFICADA' }[]) =>
            mockResponse({ ok: true, aulaId, presencas }),
    };
}