import { useEffect, useMemo, useState } from 'react';
import { Endpoints } from '@/lib/api';
import type {Aluno, Parecer} from '@/types';
import { calcularIdade } from '@/lib/format';

export default function ParecerPage() {
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [selecionado, setSelecionado] = useState<Aluno | null>(null);
    const [texto, setTexto] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const ano = useMemo(() => new Date().getFullYear(), []);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await Endpoints.alunos.list();
                setAlunos(data.alunos || data);
            } catch (error) {
                console.error('Erro ao carregar alunos:', error);
            }
        })();
    }, []);

    async function escolher(a: Aluno) {
        setSelecionado(a);
        setLoading(true);
        try {
            const { data } = await Endpoints.parecer.getByAluno(a.id);
            setTexto(data?.texto_parecer ?? '');
        } catch (error) {
            setTexto('');
        } finally {
            setLoading(false);
        }
    }

    async function salvar() {
        if (!selecionado || !texto.trim()) {
            alert('Preencha o parecer antes de salvar');
            return;
        }

        setLoading(true);
        try {
            await Endpoints.parecer.upsert(selecionado.id, { texto_parecer: texto, ano });
            alert('Parecer salvo com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar parecer:', error);
            alert('Erro ao salvar parecer');
        } finally {
            setLoading(false);
        }
    }

    const alunosFiltrados = alunos.filter(a =>
        a.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <aside className="space-y-3">
                <input
                    placeholder="Buscar aluno…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {alunosFiltrados.length === 0 && (
                        <p className="text-center text-gray-500 py-4">Nenhum aluno encontrado</p>
                    )}
                    {alunosFiltrados.map((a) => {
                        const idade = a.data_nascimento ? calcularIdade(a.data_nascimento) : a.idade;
                        return (
                            <button
                                key={a.id}
                                onClick={() => escolher(a)}
                                className={`w-full text-left rounded-xl border p-3 transition-all ${
                                    selecionado?.id === a.id
                                        ? 'ring-2 ring-emerald-500 bg-emerald-50 border-emerald-500'
                                        : 'hover:border-emerald-300'
                                }`}
                            >
                                <p className="font-medium">{a.nome}</p>
                                <p className="text-xs text-gray-500">
                                    {idade ?? '—'} anos · Frequência: {a.frequencia ?? 0}%
                                </p>
                            </button>
                        );
                    })}
                </div>
            </aside>

            <section className="lg:col-span-2 space-y-4">
                <div className="rounded-2xl border bg-white p-6">
                    <h3 className="font-semibold text-xl mb-3">
                        Parecer — {selecionado?.nome ?? 'Selecione um aluno'}
                    </h3>
                    {selecionado && (
                        <div className="text-sm text-gray-600 mb-4 pb-4 border-b">
                            <p>
                                <strong>Idade:</strong> {selecionado.data_nascimento ? calcularIdade(selecionado.data_nascimento) : selecionado.idade ?? '—'} anos
                            </p>
                            <p>
                                <strong>Frequência:</strong> {selecionado.frequencia ?? 0}%
                            </p>
                            <p>
                                <strong>Ano:</strong> {ano}
                            </p>
                        </div>
                    )}
                    <textarea
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        rows={12}
                        disabled={!selecionado || loading}
                        className="w-full rounded-xl border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                        placeholder={selecionado ? `Parecer do aluno ${selecionado.nome}…` : 'Selecione um aluno para escrever o parecer'}
                    />
                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={salvar}
                            disabled={!selecionado || loading || !texto.trim()}
                            className="rounded-xl bg-emerald-600 text-white px-6 py-2 font-medium hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                        <button
                            onClick={() => setTexto('')}
                            disabled={loading}
                            className="rounded-xl border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            Limpar
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}