import {ReactNode} from 'react';

export default function StatCard({
                                     icon,
                                     title,
                                     value
                                 }: {
    icon: ReactNode;
    title: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border bg-white p-5 shadow-sm flex items-center gap-4">
            <div className="text-3xl">{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-semibold">{value}</p>
            </div>
        </div>
    );
}