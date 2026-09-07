import { Building2, MapPin, Clock, Users, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Centre() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gestion du centre</h1>
        <p className="mt-1 text-sm text-muted-foreground">Informations et paramètres du Centre Ophtalmologique.</p>
      </div>

      {/* Centre identity */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
            <Eye className="h-7 w-7" strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Centre Ophtalmologique</h2>
            <p className="text-sm text-muted-foreground">Dr. Sabeg Ilias — Médecin Spécialiste en Ophtalmologie</p>
          </div>
        </div>
      </Card>

      {/* Informations du centre */}
      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Informations du centre</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Nom</p>
            <p className="text-sm font-medium">Centre Ophtalmologique</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Directeur médical</p>
            <p className="text-sm font-medium">Dr. Sabeg Ilias</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Spécialité</p>
            <p className="text-sm font-medium">Ophtalmologie</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Statut</p>
            <span className="inline-flex rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">Actif</span>
          </div>
        </div>
      </Card>

      {/* Coordonnées */}
      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Coordonnées</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Adresse</p>
            <p className="text-sm font-medium">À compléter</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Ville</p>
            <p className="text-sm font-medium">Khenchela</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Téléphone</p>
            <p className="text-sm font-medium">À compléter</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm font-medium">À compléter</p>
          </div>
        </div>
      </Card>

      {/* Personnel */}
      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Personnel</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">SI</div>
              <div>
                <p className="text-sm font-medium">Dr. Sabeg Ilias</p>
                <p className="text-xs text-muted-foreground">Médecin</p>
              </div>
            </div>
            <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">Actif</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">SE</div>
              <div>
                <p className="text-sm font-medium">Secrétariat</p>
                <p className="text-xs text-muted-foreground">Secrétariat</p>
              </div>
            </div>
            <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">Actif</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">AD</div>
              <div>
                <p className="text-sm font-medium">Administrateur</p>
                <p className="text-xs text-muted-foreground">Administration</p>
              </div>
            </div>
            <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">Actif</span>
          </div>
        </div>
      </Card>

      {/* Horaires */}
      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Horaires</h3>
        </div>
        <div className="space-y-2">
          {[
            { day: 'Samedi - Mercredi', hours: '08:00 - 16:30' },
            { day: 'Jeudi', hours: '08:00 - 12:00' },
            { day: 'Vendredi', hours: 'Fermé' },
          ].map((item) => (
            <div key={item.day} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
              <span className="text-sm font-medium">{item.day}</span>
              <span className="text-sm text-muted-foreground">{item.hours}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Services */}
      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Services</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Consultation', 'Examen ophtalmologique', 'Imagerie', 'Prescription', 'Suivi post-opératoire', 'Urgences oculaires'].map((service) => (
            <span key={service} className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
              {service}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
