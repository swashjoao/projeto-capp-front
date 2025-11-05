import type {StatusPresenca} from '@/types';

interface AlunoPresenca {
    id: string;
    nome: string;
    frequencia?: number;
    status?: StatusPresenca;
}

export default function PresenceList({
                                         alunos,
                                         onMark,
                                     }: {
    alunos: AlunoPresenca[];
    onMark: (alunoId: string, status: StatusPresenca) => void;
}) {
    const getStatusColor = (status?: StatusPresenca) => {
        switch (status) {
            case 'PRESENTE': return 'bg-green-100 text-green-800 border-green-300';
            case 'AUSENTE': return 'bg-red-100 text-red-800 border-red-300';
            case 'JUSTIFICADA': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        <div className="space-y-2">
            {alunos.length === 0 && (
                <p className="text-center text-gray-500 py-4">Nenhum aluno encontrado</p>
            )}
            {alunos.map((a) => (
                <div key={a.id} className="flex flex-col gap-2 rounded-xl border bg-white p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">{a.nome}</p>
                            <p className="text-xs text-gray-500">{a.frequencia ?? 0}% frequência</p>
                        </div>
                        {a.status && (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(a.status)}`}>
                                {a.status}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onMark(a.id, 'PRESENTE')}
                            className="flex-1 px-3 py-2 rounded-lg border border-green-300 bg-green-50 text-green-700 hover:bg-green-100 transition-colors text-sm font-medium"
                        >
                            Presente
                        </button>
                        <button
                            onClick={() => onMark(a.id, 'AUSENTE')}
                            className="flex-1 px-3 py-2 rounded-lg border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                            Ausente
                        </button>
                        <button
                            onClick={() => onMark(a.id, 'JUSTIFICADA')}
                            className="flex-1 px-3 py-2 rounded-lg border border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors text-sm font-medium"
                        >
                            Justificada
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}