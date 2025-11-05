import { Aluno } from '@/types';
import { calcularIdade } from '@/lib/format';
import { Edit3, Trash2 } from "lucide-react";


export default function StudentCard({
                                        aluno,
                                        onEdit,
                                        onDelete
                                    }: {
    aluno: Aluno;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}) {
    const idade = aluno.data_nascimento ? calcularIdade(aluno.data_nascimento) : aluno.idade;

    return (
        <div className="rounded-2xl border bg-white p-4 flex justify-between items-center hover:shadow-md transition-shadow">
            <div>
                <p className="font-semibold text-lg">{aluno.nome}</p>
                <p className="text-sm text-gray-500">
                    Idade: {idade ?? '—'} anos
                </p>
                <span className="inline-block mt-2 text-xs rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 px-3 py-1 font-medium">
          {aluno.frequencia ?? 0}% frequência
        </span>
            </div>
            <div className="flex items-center gap-2">
                <button
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    onClick={() => onEdit(aluno.id)}
                    title="Editar"
                >
                    <Edit3 className="w-5 h-5 text-blue-500" />
                </button>
                <button
                    className="p-2 rounded-lg border border-red-300 hover:bg-red-50 transition-colors"
                    onClick={() => onDelete(aluno.id)}
                    title="Excluir"
                >
                    <Trash2 className="w-5 h-5 text-red-500" />
                </button>
            </div>
        </div>
    );
}