import { Settings, Monitor, Clock, Bell, FileText, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

export default function Configuration() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuration</h1>
        <p className="mt-1 text-sm text-muted-foreground">Paramètres de fonctionnement du système.</p>
      </div>

      {/* Configuration générale */}
      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Configuration générale</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Nom du centre</p>
              <p className="text-xs text-muted-foreground">Centre Ophtalmologique</p>
            </div>
            <Button variant="outline" size="sm">Modifier</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Langue par défaut</p>
              <p className="text-xs text-muted-foreground">Français</p>
            </div>
            <Button variant="outline" size="sm">Modifier</Button>
          </div>
        </div>
      </Card>

      {/* Préférences d'affichage */}
      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Monitor className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Préférences d'affichage</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Thème</p>
              <p className="text-xs text-muted-foreground">{theme === 'light' ? 'Clair' : 'Sombre'}</p>
            </div>
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          </div>
        </div>
      </Card>

      {/* Paramètres de session */}
      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Paramètres de session</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Durée de session</p>
              <p className="text-xs text-muted-foreground">8 heures (par défaut)</p>
            </div>
            <Button variant="outline" size="sm">Modifier</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Déconnexion automatique</p>
              <p className="text-xs text-muted-foreground">Après période d'inactivité</p>
            </div>
            <Switch defaultChecked={false} />
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Notifications</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Notifications par email</p>
              <p className="text-xs text-muted-foreground">Rappels de rendez-vous</p>
            </div>
            <Switch defaultChecked={true} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Notifications système</p>
              <p className="text-xs text-muted-foreground">Alertes et événements</p>
            </div>
            <Switch defaultChecked={true} />
          </div>
        </div>
      </Card>

      {/* Paramètres documents */}
      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Paramètres documents</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Format d'export</p>
              <p className="text-xs text-muted-foreground">PDF</p>
            </div>
            <Button variant="outline" size="sm">Modifier</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">En-tête personnalisé</p>
              <p className="text-xs text-muted-foreground">Logo du centre sur les documents</p>
            </div>
            <Switch defaultChecked={true} />
          </div>
        </div>
      </Card>

      <Card className="flex items-start gap-3 border-border bg-muted/30 p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Ces paramètres sont affichés à titre indicatif. La persistance sera active avec l'authentification serveur.
        </p>
      </Card>
    </div>
  );
}
