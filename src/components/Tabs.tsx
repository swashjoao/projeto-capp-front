import { NavLink } from 'react-router-dom';

export function Tabs() {
    const link = (to: string, label: string) => (
        <NavLink
            to={to}
            className={({isActive}) =>
                `px-6 py-2 rounded-full border transition-colors ${
                    isActive
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-600'
                }`
            }
        >
            {label}
        </NavLink>
    );

    return (
        <div className="flex gap-3">
            {link('/professor', 'ALUNOS')}
            {link('/professor/parecer', 'PARECER')}
            {link('/professor/frequencia', 'FREQUÊNCIA')}
        </div>
    );
}