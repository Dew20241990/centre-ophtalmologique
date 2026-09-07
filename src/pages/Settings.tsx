import { useState } from 'react';
import {
  Building2, User, Palette, Globe, Bell, Calendar, Pill,
  Shield, Eye, Phone, MapPin,
} from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { useTheme } from '@/hooks/use-theme';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const sections = [
  { key: 'clinic', label: 'Informations du cabinet', icon: Building2 },
  { key: 'doctor', label: 'Informations du médecin', icon: User },
  { key: 'appearance', label: 'Apparence', icon: Palette },
  { key: 'language', label: 'Langue', icon: Globe },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'appointments', label: 'Rendez-vous', icon: Calendar },
  { key: 'prescriptions', label: 'Ordonnances', icon: Pill },
  { key: 'security', label: 'Sécurité', icon: Shield },
];

export default function Settings() {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();
  const [active, setActive] = useState('clinic');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('settings')}</h1>
        <p className="text-muted-foreground">Configuration du système</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Section sidebar */}
        <div className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.key}
                onClick={() => setActive(section.key)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  active === section.key ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                )}
              >
                <Icon className="h-4 w-4" />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div>
          {active === 'clinic' && (
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
                  <Eye className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">CENTRE OPHTALMOLOGIQUE</h3>
                  <p className="text-sm text-muted-foreground">Dr. Sabeg Ilias</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Nom du cabinet</Label>
                  <Input defaultValue="CENTRE OPHTALMOLOGIQUE" className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Médecin</Label>
                  <Input defaultValue="Dr. Sabeg Ilias" className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Téléphone</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ms-3" />
                    <Input defaultValue="0564 05 30 72" className="ps-9" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Ville</Label>
                  <Input defaultValue="Khenchela" className="mt-1" />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs text-muted-foreground">Adresse</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ms-3" />
                    <Input defaultValue="Rue Abbas Laghrour, Derrière la direction du CADASTRE, Khenchela" className="ps-9" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button size="sm">{t('save')}</Button>
              </div>
            </Card>
          )}

          {active === 'doctor' && (
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold">Informations du médecin</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label className="text-xs text-muted-foreground">Nom complet</Label><Input defaultValue="Dr. Sabeg Ilias" className="mt-1" /></div>
                <div><Label className="text-xs text-muted-foreground">Spécialité</Label><Input defaultValue="Ophtalmologie" className="mt-1" /></div>
                <div><Label className="text-xs text-muted-foreground">Téléphone</Label><Input defaultValue="0564 05 30 72" className="mt-1" /></div>
                <div><Label className="text-xs text-muted-foreground">Email</Label><Input defaultValue="sabeg@centre-ophtalmo.dz" className="mt-1" /></div>
              </div>
              <div className="flex justify-end"><Button size="sm">{t('save')}</Button></div>
            </Card>
          )}

          {active === 'appearance' && (
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold">Apparence</h3>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium">{t('darkMode')}</p>
                  <p className="text-xs text-muted-foreground">Basculer entre le mode clair et sombre</p>
                </div>
                <Switch checked={theme === 'dark'} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} />
              </div>
            </Card>
          )}

          {active === 'language' && (
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold">{t('language')}</h3>
              <div className="rounded-lg border border-primary bg-primary/5 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Français</span>
                  <span className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Langue par défaut du système</p>
              </div>
            </Card>
          )}

          {active === 'notifications' && (
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold">Notifications</h3>
              {[
                { label: 'Rendez-vous à venir', desc: 'Notification avant chaque rendez-vous' },
                { label: 'Patient en attente', desc: 'Notification quand un patient arrive' },
                { label: 'Paiement en attente', desc: 'Notification pour les factures impayées' },
                { label: 'Suivi requis', desc: 'Notification pour les suivis en retard' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={i < 2} />
                </div>
              ))}
            </Card>
          )}

          {active === 'appointments' && (
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold">Paramètres des rendez-vous</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label className="text-xs text-muted-foreground">Durée par défaut (min)</Label><Input defaultValue="30" className="mt-1" /></div>
                <div><Label className="text-xs text-muted-foreground">Heure d'ouverture</Label><Input type="time" defaultValue="08:00" className="mt-1" /></div>
                <div><Label className="text-xs text-muted-foreground">Heure de fermeture</Label><Input type="time" defaultValue="17:00" className="mt-1" /></div>
                <div><Label className="text-xs text-muted-foreground">Jours de travail</Label><Input defaultValue="Lun - Sam" className="mt-1" /></div>
              </div>
              <div className="flex justify-end"><Button size="sm">{t('save')}</Button></div>
            </Card>
          )}

          {active === 'prescriptions' && (
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold">Paramètres des ordonnances</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label className="text-xs text-muted-foreground">Préfixe numéro</Label><Input defaultValue="ORD-2026-" className="mt-1" /></div>
                <div><Label className="text-xs text-muted-foreground">Prochain numéro</Label><Input defaultValue="0002" className="mt-1" /></div>
              </div>
              <div className="flex justify-end"><Button size="sm">{t('save')}</Button></div>
            </Card>
          )}

          {active === 'security' && (
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold">Sécurité</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div><p className="text-sm font-medium">Authentification à deux facteurs</p><p className="text-xs text-muted-foreground">Sécurité supplémentaire pour la connexion</p></div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div><p className="text-sm font-medium">Expiration de session</p><p className="text-xs text-muted-foreground">Déconnexion automatique après inactivité</p></div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div><p className="text-sm font-medium">Journaux d'audit</p><p className="text-xs text-muted-foreground">Enregistrer toutes les actions</p></div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
