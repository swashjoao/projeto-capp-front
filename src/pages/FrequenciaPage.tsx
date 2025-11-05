import { useEffect, useMemo, useState } from 'react';
import { Endpoints } from '@/lib/api';
import AttendanceCalendar from '../components/AttendanceCalendar';
import PresenceList from '../components/PresenceList';
import { StatusPresenca, Aula, Oficina } from '@/types';

interface AlunoPresenca {
    id: string;
    nome: string;
    frequencia?: number;
    status?: StatusPresenca;
}

export default function FrequenciaPage() {
    const [oficinas, setOficinas] = useState<Oficina[]>([]);
    const [oficinaId, setOficinaId] = useState<string>('');
    const [refDate, setRefDate] = useState(new Date());
    const [aulaId, setAulaId] = useState<string | undefined>();
    const [alunos, setAlunos] = useState<AlunoPresenca[]>([]);
    const [aulas, setAulas] = useState<Aula[]>([]);
    const [dias, setDias] = useState<{ date: Date; aulaId?: string; titulo?: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const y = refDate.getFullYear();
    const m = refDate.getMonth();

    // Carregar oficinas
    useEffect(() => {
        (async () => {
            try {
                const {data} = await Endpoints.aulas.minhasOficinas();
                setOficinas(data);
                if (data.length > 0) {
                    setOficinaId(data[0].id);
                }
            } catch (error) {
                console.error('Erro ao carregar oficinas:', error);
            }
        })();
    }, []);

    // Carregar aulas da oficina selecionada
    useEffect(() => {
        if (!oficinaId) return;

        (async () => {
            try {
                const {data} = await Endpoints.aulas.porOficina(oficinaId);
                setAulas(data);

                // Criar calendário
                const first = new Date(y, m, 1);
                const last = new Date(y, m + 1, 0);
                const arr: { date: Date; aulaId?: string; titulo?: string }[] = [];

                // Adicionar dias vazios do início
                const firstDay = first.getDay();
                for (let i = 0; i < firstDay; i++) {
                    arr.push({date: new Date(y, m, -firstDay + i + 1)});
                }

                // Adicionar dias do mês
                for (let d = 1; d <= last.getDate(); d++) {
                    const date = new Date(y, m, d);
                    const aula = data.find((a: Aula) => {
                        const aulaDate = new Date(a.data);
                        return aulaDate.toDateString() === date.toDateString();
                    });
                    arr.push({date, aulaId: aula?.id, titulo: aula?.titulo});
                }

                setDias(arr);
            } catch (error) {
                console.error('Erro ao carregar aulas:', error);
            }
        })();
    }, [oficinaId, y, m]);

    // Carregar presenças da aula selecionada
    useEffect(() => {
        if (!aulaId) {
            setAlunos([]);
            return;
        }

        (async () => {
            setLoading(true);
            try {
                const {data} = await Endpoints.presenca.listByAula(aulaId);
                setAlunos(data?.alunos ?? data ?? []);
            } catch (error) {
                console.error('Erro ao carregar presenças:', error);
            } finally {
                setLoading(false);
            }
        })();
    }, [aulaId]);

    async function marcar(alunoId: string, status: StatusPresenca) {
        if (!aulaId) return;

        setLoading(true);
        try {
            // Atualizar localmente primeiro para feedback imediato
            setAlunos(prev => prev.map(a =>
                a.id === alunoId ? {...a, status} : a
            ));

            // Enviar para backend
            const presencas = alunos.map(a => ({
                aluno_id: a.id,
                status: a.id === alunoId ? status : (a.status || 'AUSENTE')
            }));

            await Endpoints.presenca.salvar(aulaId, presencas);

            // Recarregar presenças
            const {data} = await Endpoints.presenca.listByAula(aulaId);
            setAlunos(data?.alunos ?? data ?? []);
        } catch (error) {
            console.error('Erro ao marcar presença:', error);
            alert('Erro ao marcar presença');
        } finally {
            setLoading(false);
        }
    }

    const mesLabel = useMemo(() =>
            refDate.toLocaleDateString('pt-BR', {month: 'long', year: 'numeric'}),
        [refDate]
    );

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Controle de Frequência</h1>

            <div className="mb-4">
                <label className="block mb-2">Oficina:</label>
                <select
                    className="w-full p-2 border rounded"
                    value={oficinaId}
                    onChange={(e) => setOficinaId(e.target.value)}
                >
                    {oficinas.map((oficina) => (
                        <option key={oficina.id} value={oficina.id}>
                            {oficina.titulo}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Calendário de Aulas</h2>
                <AttendanceCalendar
                    days={dias}
                    onSelect={(aulaId) => setAulaId(aulaId)}
                />
            </div>

            {aulaId && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">Lista de Presença</h2>
                    {loading ? (
                        <div>Carregando...</div>
                    ) : (
                        <PresenceList
                            alunos={alunos}
                            onMark={marcar}
                        />
                    )}
                </div>
            )}
        </div>
    );
}