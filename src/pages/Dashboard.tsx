import {
  Users, CalendarCheck, Stethoscope, Microscope, Wallet,
  Clock, AlertCircle, Activity, ArrowRight, Calendar,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, Pie, PieChart,
} from 'recharts';
import { useI18n } from '@/i18n/I18nContext';
import { KpiCard } from '@/components/shared/KpiCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockAppointments } from '@/data/mockAppointments';
import { mockPatients } from '@/data/mockPatients';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const weeklyData = [
  { day: 'Lun', appointments: 28, consultations: 22 },
  { day: 'Mar', appointments: 34, consultations: 26 },
  { day: 'Mer', appointments: 30, consultations: 24 },
  { day: 'Jeu', appointments: 38, consultations: 30 },
  { day: 'Ven', appointments: 32, consultations: 24 },
  { day: 'Sam', appointments: 20, consultations: 16 },
  { day: 'Dim', appointments: 8, consultations: 6 },
];

const patientTypeData = [
  { name: 'Nouveaux', value: 384, color: 'hsl(var(--chart-1))' },
  { name: 'Suivi', value: 900, color: 'hsl(var(--chart-2))' },
];

const diagnosisData = [
  { name: 'Cataracte', value: 32, color: 'hsl(var(--chart-1))' },
  { name: 'Glaucome', value: 22, color: 'hsl(var(--chart-2))' },
  { name: 'DMLA', value: 18, color: 'hsl(var(--chart-3))' },
  { name: 'Rétinopathie', value: 14, color: 'hsl(var(--chart-4))' },
  { name: 'Autres', value: 14, color: 'hsl(var(--chart-5))' },
];

export default function Dashboard() {
  const { t } = useI18n();
  const navigate = useNavigate();

  const todayAppointments = mockAppointments.filter(a => a.status === 'confirmed' || a.status === 'pending').slice(0, 6);
  const recentPatients = mockPatients.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t('goodMorningEmoji')}
          </h1>
          <p className="text-muted-foreground">{t('dashboardSubtitle')}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard label={t('totalPatients')} value="1,284" icon={Users} trend={12} trendLabel={t('vsLastMonth')} />
        <KpiCard label={t('todayAppointments')} value="32" icon={CalendarCheck} trend={8} trendLabel={t('vsLastWeek')} iconBg="bg-accent/10 text-accent" />
        <KpiCard label={t('todayConsultations')} value="24" icon={Stethoscope} trend={5} trendLabel={t('vsLastWeek')} iconBg="bg-success/10 text-success" />
        <KpiCard label={t('todayExams')} value="18" icon={Microscope} trend={-3} trendLabel={t('vsLastWeek')} iconBg="bg-warning/10 text-warning" />
        <KpiCard label={t('todayRevenue')} value="86,000 DA" icon={Wallet} trend={15} trendLabel={t('vsLastMonth')} iconBg="bg-chart-5/10 text-chart-5" />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Weekly Appointments Chart */}
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{t('weeklyAppointments')}</h3>
              <p className="text-sm text-muted-foreground">Évolution des rendez-vous et consultations</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorApt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="appointments" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#colorApt)" name="Rendez-vous" />
              <Area type="monotone" dataKey="consultations" stroke="hsl(var(--chart-2))" strokeWidth={2} fill="url(#colorCons)" name="Consultations" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Patient Statistics Donut */}
        <Card className="p-5">
          <h3 className="mb-1 font-semibold">{t('patientStatistics')}</h3>
          <p className="mb-4 text-sm text-muted-foreground">Nouveaux vs patients de suivi</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={patientTypeData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {patientTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-2">
            {patientTypeData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Today's Agenda + Common Diagnoses */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Today's Agenda */}
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">{t('todayAgenda')}</h3>
            <button
              onClick={() => navigate('/appointments')}
              className="flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
            >
              Voir tout <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-2">
            {todayAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center gap-3 rounded-xl border border-border/60 p-3 transition-colors hover:bg-muted/40 cursor-pointer"
                onClick={() => navigate('/waiting-room')}
              >
                <div className="flex flex-col items-center justify-center w-12 shrink-0">
                  <span className="text-sm font-bold text-primary">{apt.time}</span>
                  <span className="text-[10px] text-muted-foreground">30 min</span>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{apt.patientName}</p>
                  <p className="truncate text-xs text-muted-foreground">{apt.reason}</p>
                </div>
                <StatusBadge status={apt.status} />
              </div>
            ))}
          </div>
        </Card>

        {/* Common Diagnoses */}
        <Card className="p-5">
          <h3 className="mb-1 font-semibold">{t('commonDiagnoses')}</h3>
          <p className="mb-4 text-sm text-muted-foreground">Répartition des diagnostics</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={diagnosisData} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {diagnosisData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Patients + Alerts */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Patients */}
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">{t('recentPatients')}</h3>
            <button
              onClick={() => navigate('/patients')}
              className="flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
            >
              Voir tout <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-2">
            {recentPatients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center gap-3 rounded-xl border border-border/60 p-3 transition-colors hover:bg-muted/40 cursor-pointer"
                onClick={() => navigate(`/patient/${patient.id}`)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {patient.firstName[0]}{patient.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{patient.firstName} {patient.lastName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {patient.patientId} · {new Date().getFullYear() - new Date(patient.birthDate).getFullYear()} ans · {patient.gender === 'male' ? 'Homme' : 'Femme'}
                  </p>
                </div>
                {patient.lastDiagnosis && (
                  <span className="hidden sm:inline-flex rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    {patient.lastDiagnosis}
                  </span>
                )}
                <StatusBadge status={patient.status === 'active' ? 'confirmed' : 'cancelled'} />
              </div>
            ))}
          </div>
        </Card>

        {/* Alerts & Reminders */}
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-warning" />
            <h3 className="font-semibold">{t('alertsReminders')}</h3>
          </div>
          <div className="space-y-3">
            {[
              { icon: Clock, text: '3 patients en attente', sub: 'Salle d\'attente', color: 'text-warning', bg: 'bg-warning/10' },
              { icon: Calendar, text: '5 rendez-vous à confirmer', sub: 'Cette semaine', color: 'text-primary', bg: 'bg-primary/10' },
              { icon: Activity, text: '2 suivis en retard', sub: 'Contrôle requis', color: 'text-destructive', bg: 'bg-destructive/10' },
              { icon: Wallet, text: '3 factures impayées', sub: 'Total: 12,500 DA', color: 'text-warning', bg: 'bg-warning/10' },
            ].map((alert, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-border/60 p-3">
                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', alert.bg, alert.color)}>
                  <alert.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{alert.text}</p>
                  <p className="text-xs text-muted-foreground">{alert.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
