import { useState } from 'react';
import {
  CreditCard, Wallet, TrendingUp, Clock, Plus, Download,
  MoreHorizontal,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import { useI18n } from '@/i18n/I18nContext';
import { mockInvoices } from '@/data/mockClinical';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KpiCard } from '@/components/shared/KpiCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { cn } from '@/lib/utils';

const revenueData = [
  { day: 'Lun', revenue: 72000 },
  { day: 'Mar', revenue: 95000 },
  { day: 'Mer', revenue: 81000 },
  { day: 'Jeu', revenue: 102000 },
  { day: 'Ven', revenue: 86000 },
  { day: 'Sam', revenue: 54000 },
  { day: 'Dim', revenue: 18000 },
];

const monthlyData = [
  { month: 'Avr', revenue: 1820000 },
  { month: 'Mai', revenue: 1950000 },
  { month: 'Juin', revenue: 2100000 },
  { month: 'Juil', revenue: 2280000 },
  { month: 'Août', revenue: 2050000 },
  { month: 'Sep', revenue: 508000 },
];

export default function Billing() {
  const { t } = useI18n();
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  const totalRemaining = mockInvoices.reduce((sum, inv) => sum + inv.remaining, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('billing')}</h1>
          <p className="text-muted-foreground">{mockInvoices.length} factures · {totalRemaining.toLocaleString()} DA en attente</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            {t('export')}
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle facture
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Revenus du jour" value="86,000 DA" icon={Wallet} trend={15} trendLabel={t('vsLastMonth')} />
        <KpiCard label="Revenus de la semaine" value="508,000 DA" icon={TrendingUp} trend={8} trendLabel={t('vsLastWeek')} iconBg="bg-accent/10 text-accent" />
        <KpiCard label="Revenus du mois" value="2,280,000 DA" icon={CreditCard} trend={12} trendLabel={t('vsLastMonth')} iconBg="bg-success/10 text-success" />
        <KpiCard label="Paiements en attente" value={`${totalRemaining.toLocaleString()} DA`} icon={Clock} iconBg="bg-warning/10 text-warning" />
      </div>

      {/* Revenue chart */}
      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Évolution des revenus</h3>
          <div className="flex gap-1 rounded-lg border border-border p-1">
            <button onClick={() => setPeriod('week')} className={cn('rounded-md px-3 py-1 text-xs font-medium', period === 'week' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}>Semaine</button>
            <button onClick={() => setPeriod('month')} className={cn('rounded-md px-3 py-1 text-xs font-medium', period === 'month' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}>6 mois</button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          {period === 'week' ? (
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} formatter={(v: number) => `${v.toLocaleString()} DA`} />
              <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000000}M`} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} formatter={(v: number) => `${v.toLocaleString()} DA`} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#colorRev)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </Card>

      {/* Invoices table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">Facture</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('patient')}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('date')}</th>
                <th className="px-4 py-3 text-end text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
                <th className="px-4 py-3 text-end text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payé</th>
                <th className="px-4 py-3 text-end text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reste</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Statut</th>
                <th className="px-4 py-3 text-end text-xs font-semibold uppercase tracking-wider text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {mockInvoices.map((inv) => (
                <tr key={inv.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3 text-sm">{inv.patientName}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{inv.date}</td>
                  <td className="px-4 py-3 text-end text-sm font-medium">{inv.total.toLocaleString()} DA</td>
                  <td className="px-4 py-3 text-end text-sm text-success font-medium">{inv.paid.toLocaleString()} DA</td>
                  <td className="px-4 py-3 text-end text-sm text-warning font-medium">{inv.remaining.toLocaleString()} DA</td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={inv.paymentStatus} type="payment" /></td>
                  <td className="px-4 py-3 text-end">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
