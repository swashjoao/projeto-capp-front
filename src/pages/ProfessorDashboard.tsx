import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Endpoints } from '@/lib/api';
import StatCard from '../components/StatCard';
import { Tabs } from '@/components/Tabs';
import Layout from '../components/Layout';
import type {DashboardResumo} from '@/types';
import { FileText, CalendarDays, Users } from "lucide-react";


export default function ProfessorDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardResumo>({
        totalAlunos: 0,
        frequenciaMedia: 0,
        pareceresPendentes: 0,
    });

    useEffect(() => {
        (async () => {
            try {
                const { data } = await Endpoints.dashboard();
                setStats(data);
            } catch (error) {
                console.error('Erro ao carregar dashboard:', error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return (
        <Layout>
            <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando...</p>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="mx-auto max-w-6xl p-6 space-y-6">
                <header className="space-y-4">
                    <h1 className="text-2xl font-bold text-gray-800">Painel do Professor</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatCard
                            icon={<FileText className="w-6 h-6 text-blue-500" />}
                            title="Pareceres Pendentes"
                            value={String(stats?.pareceresPendentes ?? 0)}
                        />

                        <StatCard
                            icon={<CalendarDays className="w-6 h-6 text-green-500" />}
                            title="Frequência Média"
                            value={`${stats?.frequenciaMedia ?? 0}%`}
                        />

                        <StatCard
                            icon={<Users className="w-6 h-6 text-purple-500" />}
                            title="Total de Alunos"
                            value={String(stats?.totalAlunos ?? 0)}
                        />
                    </div>
                </header>

                <div className="flex items-center justify-between">
                    <Tabs />
                </div>

                <Outlet />
            </div>
        </Layout>
    );
}