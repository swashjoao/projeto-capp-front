interface Day {
    date: Date;
    aulaId?: string;
    titulo?: string;
}

export default function AttendanceCalendar({
                                               days,  // <-- Expects 'days' prop
                                               selectedAulaId,
                                               onSelect
                                           }: {
    days: Day[];
    selectedAulaId?: string;
    onSelect: (aulaId?: string) => void;
}) {
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
        <div>
            <div className="grid grid-cols-7 gap-2 mb-2">
                {diasSemana.map((dia) => (
                    <div key={dia} className="text-center text-xs font-medium text-gray-500 py-1">
                        {dia}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {days.map((d, i) => (
                    <button
                        key={i}
                        onClick={() => d.aulaId && onSelect(d.aulaId)}
                        disabled={!d.aulaId}
                        className={`h-16 rounded-xl border flex flex-col items-center justify-center transition-colors ${
                            d.aulaId
                                ? selectedAulaId === d.aulaId
                                    ? 'bg-emerald-600 border-emerald-600 text-white'
                                    : 'bg-emerald-50 border-emerald-300 hover:bg-emerald-100 cursor-pointer'
                                : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                        }`}
                    >
                        <span className="text-xs font-medium">{d.date.getDate()}</span>
                        {d.aulaId && <span className="text-[10px] mt-1">✓</span>}
                    </button>
                ))}
            </div>
        </div>
    );
}