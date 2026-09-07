import { useState } from 'react';
import {
  Users, CalendarCheck, Stethoscope, Wallet,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useI18n } from '@/i18n/I18nContext';
import { Card } from '@/components/ui/card';
import { KpiCard } from '@/components/shared/KpiCard';
import { cn } from '@/lib/utils';

const periods = [
  { key: 'today', label: "Aujourd'hui" },
  { key: '7d', label: '7 jours' },
  { key: '30d', label: '30 jours' },
  { key: '3m', label: '3 mois' },
  { key: '12m', label: '12 mois' },
];

const patientGrowth = [
  { month: 'Avr', new: 42, returning: 120 },
  { month: 'Mai', new: 55, returning: 135 },
  { month: 'Juin', new: 48, returning: 142 },
  { month: 'Juil', new: 62, returning: 158 },
  { month: 'Août', new: 38, returning: 145 },
  { month: 'Sep', new: 28, returning: 98 },
];

const appointmentData = [
  { day: 'Lun', value: 28 },
  { day: 'Mar', value: 34 },
  { day: 'Mer', value: 30 },
  { day: 'Jeu', value: 38 },
  { day: 'Ven', value: 32 },
  { day: 'Sam', value: 20 },
  { day: 'Dim', value: 8 },
];

const diagnosisData = [
  { name: 'Cataracte', value: 32, color: 'hsl(var(--chart-1))' },
  { name: 'Glaucome', value: 22, color: 'hsl(var(--chart-2))' },
  { name: 'DMLA', value: 18, color: 'hsl(var(--chart-3))' },
  { name: 'Rétinopathie', value: 14, color: 'hsl(var(--chart-4))' },
  { name: 'Autres', value: 14, color: 'hsl(var(--chart-5))' },
];

const revenueData = [
  { month: 'Avr', value: 1820000 },
  { month: 'Mai', value: 1950000 },
  { month: 'Juin', value: 2100000 },
  { month: 'Juil', value: 2280000 },
  { month: 'Août', value: 2050000 },
  { month: 'Sep', value: 508000 },
];

export default function Statistics() {
  const { t } = useI18n();
  const [period, setPeriod] = useState('30d');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('statistics')}</h1>
          <p className="text-muted-foreground">Analyse de l'activité du centre</p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-card p-1">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={cn('rounded-md px-3 py-1.5 text-xs font-medium transition-all', period === p.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label={t('totalPatients')} value="1,284" icon={Users} trend={12} trendLabel={t('vsLastMonth')} />
        <KpiCard label={t('todayAppointments')} value="1,284" icon={CalendarCheck} trend={8} trendLabel={t('vsLastMonth')} iconBg="bg-accent/10 text-accent" />
        <KpiCard label={t('todayConsultations')} value="968" icon={Stethoscope} trend={5} trendLabel={t('vsLastMonth')} iconBg="bg-success/10 text-success" />
        <KpiCard label="Revenus" value="10.8M DA" icon={Wallet} trend={15} trendLabel={t('vsLastMonth')} iconBg="bg-chart-5/10 text-chart-5" />
      </div>

      {/* Patient Growth */}
      <Card className="p-5">
        <h3 className="mb-4 font-semibold">Croissance des patients</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={patientGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line type="monotone" dataKey="new" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Nouveaux" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="returning" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Suivi" dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Weekly Appointments */}
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">Rendez-vous par jour</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={appointmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Diagnosis Distribution */}
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">{t('commonDiagnoses')}</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={diagnosisData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent! * 100).toFixed(0)}%`} labelLine={false} style={{ fontSize: '11px' }}>
                {diagnosisData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Revenue Trend */}
      <Card className="p-5">
        <h3 className="mb-4 font-semibold">Évolution des revenus (6 mois)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={revenueData}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000000}M`} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} formatter={(v: number) => `${v.toLocaleString()} DA`} />
            <Line type="monotone" dataKey="value" stroke="hsl(var(--chart-5))" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
