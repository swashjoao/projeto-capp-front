import { useEffect, useState } from 'react';
import { Endpoints } from '../lib/api';
import StudentCard from '../components/StudentCard';
import type {Aluno} from '../types';

export default function AlunosPage() {
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [loading, setLoading] = useState(true);

    async function load() {
        try {
            const { data } = await Endpoints.alunos.list();
            setAlunos(data.alunos || data);
        } catch (error) {
            console.error('Erro ao carregar alunos:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            </div>
        );
    }

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Alunos da Oficina</h2>
                <span className="text-sm text-gray-500">{alunos.length} aluno(s)</span>
            </div>
            {alunos.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-2xl border">
                    <p className="text-gray-500">Nenhum aluno encontrado</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {alunos.map((a) => (
                        <StudentCard
                            key={a.id}
                            aluno={a}
                            onEdit={(id) => {
                                console.log('Editar aluno:', id);
                                // TODO: Implementar modal de edição
                            }}
                            onDelete={async (id) => {
                                if (confirm('Deseja realmente excluir este aluno?')) {
                                    try {
                                        await Endpoints.alunos.remove(id);
                                        load();
                                    } catch (error) {
                                        console.error('Erro ao excluir aluno:', error);
                                        alert('Erro ao excluir aluno');
                                    }
                                }
                            }}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}